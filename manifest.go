package main

import (
	"errors"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"os"
	"path/filepath"
)

type InstallManifest map[string]InstalledModule

func (m InstallManifest) Get(alias string) (InstalledModule, bool) {
	val, ok := m[alias]
	return val, ok
}

func (m InstallManifest) Add(alias string, module InstalledModule) error {
	_, ok := m[alias]
	if ok {
		return errors.New(alias + " is already in use by another module")
	}

	m[alias] = module

	return nil
}

type InstalledModule struct {
	Url string `yaml:"url"`
}

func getManifestPath() (string, error) {
	dir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(dir, "helpful-cli", "manifest.yml"), nil
}

func loadManifest() (InstallManifest, error) {
	manifestPath, err := getManifestPath()
	if err != nil {
		return nil, err
	}

	if !fileExists(manifestPath) {
		return InstallManifest{}, nil
	}

	data, err := ioutil.ReadFile(manifestPath)
	if err != nil {
		return nil, err
	}

	install := InstallManifest{}

	if err := yaml.Unmarshal(data, &install); err != nil {
		return nil, err
	}

	return install, nil
}

func saveManifest(manifest InstallManifest) error {
	if manifest == nil {
		return errors.New("manifest cannot be nil")
	}

	manifestPath, err := getManifestPath()
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(manifestPath), os.ModePerm); err != nil {
		return err
	}

	data, err := yaml.Marshal(manifest)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(manifestPath, data, os.ModePerm)
}
