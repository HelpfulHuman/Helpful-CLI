package main

import "github.com/spf13/cobra"

var installCmd = &cobra.Command{
	Use:   "install",
	Short: "Installs a Helpful CLI module onto your machine",
	Long:  "Downloads and installs a Helpful CLI module onto your machine for generating templates and running commands.",
	RunE:  runInstall,
}

func runInstall(cmd *cobra.Command, args []string) error {
	return nil
}
