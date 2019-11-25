package main

import (
	survey "github.com/AlecAivazis/survey/v2"
	"path/filepath"
)

type Config struct {
	Templates map[string]TemplateConfig `yaml:"templates"`
}

func (c *Config) Validate() (ok bool, problems []string) {
	// TODO: add validation of config
	return true, problems
}

type TemplateConfig struct {
	Variables map[string]TemplateVariableConfig `yaml:"vars"`
	Files     []TemplateFileConfig              `yaml:"files"`
}

func (tc *TemplateConfig) GenerateSurvey() []*survey.Question {
	questions := []*survey.Question{}

	for key, conf := range tc.Variables {
		var prompt survey.Prompt
		var validation survey.Validator

		msg := conf.Message

		if conf.DefaultValue == "" {
			validation = survey.Required
		}

		if len(conf.Options) > 0 {
			prompt = &survey.Select{
				Message: msg,
				Options: conf.Options,
				Default: conf.DefaultValue,
			}
		} else {
			prompt = &survey.Input{
				Message: msg,
				Default: conf.DefaultValue,
			}
		}

		questions = append(questions, &survey.Question{
			Name:     key,
			Prompt:   prompt,
			Validate: validation,
		})
	}

	return questions
}

type TemplateVariableConfig struct {
	Message      string   `yaml:"message"`
	Options      []string `yaml:"options"`
	DefaultValue string   `yaml:"default"`
}

type TemplateFileConfig struct {
	Path  string `yaml:"path"`
	Alias string `yaml:"alias"`
}

func (tc *TemplateFileConfig) SourcePath(installDir string) string {
	return filepath.Join(installDir, tc.Path)
}

func (tc *TemplateFileConfig) TargetPath(targetDir string) string {
	filename := tc.Path

	if tc.Alias != "" {
		filename = tc.Alias
	}

	return filepath.Join(targetDir, filename)
}

type TemplateData struct {
	ProjectDir string
	Vars       map[string]interface{}
}
