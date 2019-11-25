package main

import (
	"context"
	"fmt"
	"github.com/AlecAivazis/survey/v2"
	"github.com/hashicorp/go-getter"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"log"
	"os"
	"os/signal"
	"strings"
	"sync"
)

var installCmd = &cobra.Command{
	Use:   "install <url>",
	Short: "Installs a Helpful CLI module onto your machine",
	Long:  "Downloads and installs a Helpful CLI module onto your machine for generating templates and running commands.",
	RunE:  runInstall,
}

func runInstall(cmd *cobra.Command, args []string) error {
	if len(args) < 0 {
		return errors.New("a module url must be supplied, example: github.com/helpfulhuman/cli-templates")
	}

	mode := getter.ClientModeAny

	// get the name of the module
	ss := strings.Split(args[0], "/")
	name := ss[len(ss)-1]

	if err := survey.AskOne(&survey.Input{
		Message: "Install module as:",
		Default: name,
	}, &name); err != nil {
		return fmt.Errorf("failed to get module name input: %v", err)
	}

	// TODO: validate the given name and make sure its alphanumerics only

	dest, err := getModuleInstallPath(name)
	if err != nil {
		return fmt.Errorf("failed to get install path for module: %v", err)
	}

	// Get the pwd
	pwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting wd: %s", err)
	}

	opts := []getter.ClientOption{}

	ctx, cancel := context.WithCancel(context.Background())
	// Build the client
	client := &getter.Client{
		Ctx:     ctx,
		Src:     args[0],
		Dst:     dest,
		Pwd:     pwd,
		Mode:    mode,
		Options: opts,
	}

	wg := sync.WaitGroup{}
	wg.Add(1)
	errChan := make(chan error, 2)
	go func() {
		defer wg.Done()
		defer cancel()
		if err := client.Get(); err != nil {
			errChan <- err
		}
	}()

	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt)

	select {
	case sig := <-c:
		signal.Reset(os.Interrupt)
		cancel()
		wg.Wait()
		log.Printf("signal %v", sig)
	case <-ctx.Done():
		wg.Wait()
		log.Printf("success!")
	case err := <-errChan:
		wg.Wait()
		log.Fatalf("Error downloading: %s", err)
	}

	return nil
}