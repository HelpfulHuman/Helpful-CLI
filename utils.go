package main

import (
	"github.com/pkg/errors"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

func getModuleInstallPath(moduleName string) (string, error) {
	dir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(dir, "helpful-cli", "installed", moduleName), nil
}

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

func loadInstalledModuleConfig(modulePath string) (cfg *Config, err error) {
	configPaths := []string{
		filepath.Join(modulePath, "helpful.yml"),
		filepath.Join(modulePath, "helpful.yaml"),
	}

	for _, configPath := range configPaths {
		contents := []byte{}
		cfg = &Config{}

		if fileExists(configPath) {
			contents, err = ioutil.ReadFile(configPath)
			if err != nil {
				return
			}

			err = yaml.Unmarshal(contents, cfg)

			return
		}
	}

	err = errors.New("unable to locate config file in paths: " + strings.Join(configPaths, " "))
	return
}

func listInstalledModules() ([]string, error) {
	installPath, err := getModuleInstallPath("")
	if err != nil {
		return nil, err
	}

	installed := []string{}

	if err = filepath.Walk(installPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			installed = append(installed, info.Name())
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return installed, nil
}
