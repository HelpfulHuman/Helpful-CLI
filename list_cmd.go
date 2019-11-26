package main

import (
	"fmt"
	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "Lists the installed modules on this machine",
	Long:  "Lists all of the modules that you have downloaded and installed on this machine.",
	RunE:  runList,
}

func runList(cmd *cobra.Command, args []string) error {

	// load the installed manifest
	manifest, err := loadManifest()
	if err != nil {
		return fmt.Errorf("failed to load installation manifest: %v", err)
	}

	for alias, module := range manifest {
		fmt.Printf("%s   ( %s )\n", alias, module.Url)
	}

	return nil
}
