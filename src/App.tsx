import React, { useEffect } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import Footer from "./components/Footer";

const welcomeMessage = `toczektomasz@proxmox: cat helloword.txt
Howdy, nice to see you there!

Type 'help' to view a list of available commands.`;

const bannerCondensed =
  " _                     _      _                                 \n" +
  "| |                   | |    | |                                \n" +
  "| |_ ___   ___ _______| | __ | |_ ___  _ __ ___   __ _ ___ ____\n" +
  "| __/ _ \\ / __|_  / _ \\ |/ / | __/ _ \\| '_ ` _ \\ / _` / __|_  / \n" +
  "| || (_) | (__ / /  __/   <  | || (_) | | | | | | (_| \\__ \\/ /  \n" +
  "\\___\\___/ \\___/___\\___|_|\\_\\ \\___\\___/|_| |_| |_|\\__,_|___/___|  \n" +
  " ";

const prompt = ">";

function App() {
  return (
    <>
      <Terminal welcomeMessage={welcomeMessage} banner={bannerCondensed} terminalPrompt={prompt} />
      <Footer />
    </>
  );
}

export default App;
