package main

import (
	"errors"
	"fmt"
	"github.com/AlecAivazis/survey/v2"
	"github.com/spf13/cobra"
	"os"
	"strings"
	"text/template"
)

var (
	addCmd = &cobra.Command{
		Use:   "add [module/template]",
		Short: "Compiles and copies template files to your current directory",
		Long:  "Attempts to find, build and copy module template files into the current working directory.",
		RunE:  runAdd,
	}
)

func runAdd(cmd *cobra.Command, args []string) error {

	// make sure we have the module name argument
	if len(args) < 1 {
		return errors.New("you must provide the name of an installed module")
	}

	// get the module and template names
	parts := strings.Split(args[0], "/")
	moduleName := parts[0]
	templateName := parts[1]

	// get the Path for the module
	modulePath, err := getModuleInstallPath(moduleName)
	if err != nil {
		return fmt.Errorf("unable to find module Path: %v", err)
	}

	// get the configuration for the module
	cfg, err := loadInstalledModuleConfig(modulePath)
	if err != nil {
		return err
	}

	// find the requested template in the module config
	templateConfig, ok := cfg.Templates[templateName]
	if !ok {
		return errors.New("unable to find template: " + args[0])
	}

	// prompt user for missing arguments
	questions := templateConfig.GenerateSurvey()
	vars := map[string]interface{}{}

	if err = survey.Ask(questions, &vars); err != nil {
		return fmt.Errorf("survey failed: %v", err)
	}

	// get the current working directory
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}

	// create the template data for the templates
	data := TemplateData{
		ProjectDir: cwd,
		Vars:       vars,
	}

	// copy the template files into the target directory
	for _, copy := range templateConfig.Files {
		from := copy.SourcePath(modulePath)
		to := copy.TargetPath(cwd)

		if !fileExists(from) {
			return errors.New("script failed due to missing template file: " + from)
		}

		tmpl, err := template.ParseFiles(from)
		if err != nil {
			return fmt.Errorf("failed to parse template file: %v", err)
		}

		f, err := os.Create(to)
		if err != nil {
			return fmt.Errorf("failed to create stream for writing file: %v", err)
		}

		if err = tmpl.Execute(f, &data); err != nil {
			return fmt.Errorf("failed to compile and write template to file: %v", err)
		}

		err = f.Close()
		if err != nil {
			return fmt.Errorf("failed to close file stream: %v", err)
		}
	}

	return nil
}
