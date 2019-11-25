package main

import (
	"fmt"
	"github.com/spf13/cobra"
)

var (
	rootCmd = &cobra.Command{
		Use:   "helpme",
		Short: "",
		Long:  "",
	}
)

func init() {
	//rootCmd.AddCommand(initCmd)
	rootCmd.AddCommand(installCmd)
	rootCmd.AddCommand(addCmd)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		// TODO: format error message with colors
		fmt.Errorf("FAILED: %v", err)
		return
	}

	// TODO: display success message with colors
}
