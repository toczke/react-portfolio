import React, { useState, useEffect } from "react";
import Banner from "./Banner";
import TerminalOutput from "./TerminalOutput";
import InputArea from "./InputArea";
import ErrorMessage from "./ErrorMessage";
import WelcomeMessage from "./WelcomeMessage";

const getAge = (birthDate: Date) => {
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const downloadFile = (uri: string, downloadName: string) => {
  const link = document.createElement("a");
  link.download = downloadName;
  link.href = uri;
  link.click();
  link.remove();
};

type TerminalProps = {
  terminalPrompt?: string;
  banner?: string;
  welcomeMessage?: string;
  footer?: React.ElementType;
};

const fetchOSRSStats = async (username: string) => {
  const proxies = [
    "https://cors-anywhere.herokuapp.com/",
    "https://api.codetabs.com/v1/proxy/",
    "https://thingproxy.freeboard.io/fetch/",
    "https://api.allorigins.win/raw?url=", 
    "https://cors-proxy.htmldriven.com/?url="
  ];

  const apiUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`;

  for (const proxyUrl of proxies) {
    try {
      const fullUrl = proxyUrl + apiUrl;
      const response = await fetch(fullUrl, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      console.log(`API Response Status with ${proxyUrl}:`, response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch OSRS stats with proxy ${proxyUrl}. Status: ${response.status}`);
      }

      const data = await response.text();
      console.log("API Response Data:", data);
      return data;
    } catch (error) {
      console.error(`Error with ${proxyUrl}:`, error);
    }
  }

  console.error("All proxies failed to fetch OSRS stats.");
  return null;
};


const parseOSRSStats = (data: string) => {
  const stats = data.split("\n").map((line) => line.split(","));
  const statNames = [
    "Overall",
    "Attack",
    "Defence",
    "Strength",
    "Hitpoints",
    "Ranged",
    "Prayer",
    "Magic",
    "Cooking",
    "Woodcutting",
    "Fletching",
    "Fishing",
    "Firemaking",
    "Crafting",
    "Smithing",
    "Mining",
    "Herblore",
    "Agility",
    "Thieving",
    "Slayer",
    "Farming",
    "Runecraft",
    "Hunter",
    "Construction",
  ];

  const parsedStats = statNames.map((name, index) => ({
    name,
    rank: parseInt(stats[index][0]),
    level: parseInt(stats[index][1]),
    experience: parseInt(stats[index][2]),
  }));

  return parsedStats;
};

const Terminal = (props: TerminalProps) => {
  const { terminalPrompt = ">", banner, welcomeMessage } = props;
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(3);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const scrollLastCommandTop = () => {
    scrollRef.current?.scrollIntoView();
  };

  useEffect(scrollLastCommandTop, [output]);

  const echoCommands = [
    "help",
    "whoami",
    "projects",
    "homelab",
    "contact",
    "github",
    "skills",
    "experience",
    "runescape",
  ] as const;
  type EchoCommand = typeof echoCommands[number];
  const utilityCommands = ["clear", "ls -la", "cv"] as const;
  type UtilityCommand = typeof utilityCommands[number];
  const allCommands = [...echoCommands, ...utilityCommands] as const;
  type Command = typeof allCommands[number];

  function isEchoCommand(arg: string): arg is EchoCommand {
    return (echoCommands as ReadonlyArray<string>).includes(arg);
  }

  function isUtilityCommand(arg: string): arg is UtilityCommand {
    return (utilityCommands as ReadonlyArray<string>).includes(arg);
  }

  function isValidCommand(arg: string): arg is Command {
    return isEchoCommand(arg) || isUtilityCommand(arg);
  }

  const glow = (text: string) => {
    return <span className="terminal-glow">{text}</span>;
  };

  const commands: { [key in EchoCommand]: JSX.Element } = {
    help: (
      <div>
        <p>
            <ul>
              <li>
                <strong>cv</strong>
              </li>
              <li>
                <strong>whoami</strong>
              </li>
              <li>
                <strong>experience</strong>
              </li>
              <li>
                <strong>skills</strong>
              </li>
              <li>
                <strong>projects</strong>
              </li>
              <li>
                <strong>github</strong>
              </li>
              <li>
                <strong>homelab</strong>
              </li>
              <li>
                <strong>contact</strong>
              </li>
              <li>
                <strong>ls -la</strong>
              </li>
              <li>
                <strong>clear</strong>
              </li>
            </ul>
          </p>
      </div>
    ),
    whoami: (
      <div>
        <p>
          So, let’s start with the basics—I'm {glow("Tomasz Toczek")}, a{" "}
          {getAge(new Date(1997, 1, 15))} year old {glow("Test Engineer")} based
          in Gdańsk 🌊, Poland. I've built a career focusing on test automation,
          end-to-end testing, and IT infrastructure support, backed by a solid
          foundation in system administration and hardware. My journey into IT
          wasn't straightforward—I transitioned from a career in sales, where I
          worked as a representative and manager. Looking back, I often think I
          should’ve made the switch to IT earlier, but I’m glad I finally did!
        </p>
        <p>
          I’m self-taught and passionate about learning, having transitioned into
          software testing where I specialize in tools like Playwright,
          JavaScript. Problem-solving is my strong suit, and I thrive when
          tackling new challenges, especially in unfamiliar tech spaces.
        </p>
        <p>
          When I’m not working, you’ll likely find me tinkering with various
          environments and automation setups in my home lab. I’ve repurposed old
          desktops into a personal playground where I experiment with different
          technologies and solutions.
        </p>
        <p>
          Beyond tech, I’m also passionate about cars (mostly those rusty and
          weird ones). And of course, I also unwind by playing some games (I’ve
          been playing Old School{" "}
          <span style={{ color: "yellow", fontWeight: "bold" }}>
            RuneScape
          </span>{" "}
          for way too long, never quit just taking breaks). Whether it's
          exploring new tech or enjoying a bit of gaming.
        </p>
        <p>
          I’m always open to exploring new opportunities and contributing my
          skills to innovative projects. If you're interested in collaborating or
          just want to chat, feel free to reach out!
        </p>
      </div>
    ),
    projects: (
      <>
        <p>
          All of these projects were made to help me learn by doing. I don't
          treat them as profit-driven ventures; they are purely for personal
          growth and experimentation. Code-wise, yes they can be better but 
          thats a learning curve. Every new interation is better than older one!
          You may be wondering, where are QA-related projects? Well, under-way for sure. 
          Some of my ideas aren't really legal... (messing with OLX scams).
        </p>
        <p>
          <a href="https://github.com/toczke/react-portfolio" style={{ color: "#bd93f9" }}>
            <strong>React interactive portfolio</strong>
          </a>
          <br />
          <p>
          It's time to shine! Right? Maybe my resume is AI-proof, however it looks boring. So, I created this interactive portfolio to showcase my skills in a more dynamic and engaging way. It's built using the latest web technologies, so it truly reflects my capabilities. (that's my first time with real frontend btw)
          </p>         
          <br />
          <strong>Used stack:</strong>
          <br />
          Frontend:
          <ul>
            <li>React</li>
            <li>Typescript</li>
          </ul>
          Platform:
          <ul>
            <li>Docker</li>
          </ul>
        </p>
        <p>
          <a href="https://github.com/toczke/time-register" style={{ color: "#bd93f9" }}>
            <strong>Time Register</strong>
          </a>
          <br />
          <p>
            The Time Register App is a comprehensive tool designed for managing
            and tracking employee time entries, including vacation and leave
            approvals, user roles, and team management. It is built with a
            microservices architecture to ensure ease of deployment,
            upgradability, and future scalability. By splitting the application
            into modular, independent services, we can update, maintain, and
            scale each component independently without affecting the overall
            system. This approach provides flexibility to add new features and
            improvements down the line, ensuring the app can grow alongside the
            needs of the organization.
          </p>
          <br />
          <strong>Used stack:</strong>
          <br />
          Backend:
          <ul>
            <li>JavaScript</li>
            <li>Express</li>
          </ul>
          Frontend:
          <p>Still a work in progress — can't decide what to use yet.</p>
          DB:
          <ul>
            <li>MariaDB</li>
          </ul>
          Platform:
          <ul>
            <li>Docker (for now)</li>
          </ul>
        </p>

        <p>
          <a href="https://github.com/toczke/time-register-documentation" style={{ color: "#bd93f9" }}>
            <strong>Time Register Documentation</strong>
          </a>
          <br />
          RedoCly API documentation for users once the app goes live.
        </p>

        <p>
          <a href="https://github.com/toczke/happka" style={{ color: "#bd93f9" }}>
            <strong>HAppka (WIP)</strong>
          </a>
          <br />
          A frontend addon to Home Assistant to show Żappsy count and valid QR
          code for scanning. Sharing is caring ❤️, so we use the same account
          within the house.
          <br />
          <strong>Used stack:</strong>
          <ul>
            <li>Backend: Node.js</li>
            <li>Platform: HACS</li>
          </ul>
        </p>

        <p>
          <a href="https://github.com/toczke/Aorus-B760M-Elite-X-AX-hackintosh" style={{ color: "#bd93f9" }}>
            <strong>Aorus-B760M-Elite-X-AX-Hackintosh</strong>
          </a>
          <br />
          Complete and stable EFI for my Hackintosh build.
        </p>

        <p>
          <strong>Legacy Projects:</strong>
        </p>
        <ul>
          <li>
            <a href="#" style={{ color: "#bd93f9" }}>
              <strong>HP8200NVMe</strong>
            </a>{" "}
            - BIOS mod for Ivy and Sandy Bridge HP Desktops to add boot from NVMe
            SSD.
          </li>
          <li>
            <a href="https://github.com/toczke/toogoodtogo-bot" style={{ color: "#bd93f9" }}>
              <strong>toogoodtogo-bot</strong>
            </a>{" "}
            - Dockerized it.
          </li>
        </ul>
      </>
    ),
    contact: (
      <>
        <dl>
          <dt>Email</dt>
          <dd>
            <a href="mailto:toczektomasz@outlook.com">toczektomasz@outlook.com</a>
          </dd>
          <dt>LinkedIn</dt>
          <dd>
            <a href="https://www.linkedin.com/in/toczek-tomasz/">
              linkedin.com/in/toczek-tomasz
            </a>
          </dd>
          <dt>Gadu-Gadu</dt>
          <dd>Yuck! There's no way that I'm gonna use that!</dd>
        </dl>
      </>
    ),
    github: (
      <>
        <ul>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/toczke"
            >
              GitHub
            </a>{" "}
            - Click on this fancy violet text to check my repo.
          </li>
        </ul>
      </>
    ),
    skills: (
      <>
        <div className="terminal-heading">Programming Languages</div>
        <ul>
          <li>JavaScript / TypeScript</li>
        </ul>

        <div className="terminal-heading">Tools and Frameworks</div>
        <ul>
          <li>Git (GitHub/GitLab)</li>
          <li>Docker</li>
          <li>Playwright</li>
          <li>SQL</li>
          <li>AWS</li>
          <li>Postman</li>
        </ul>

        <div className="terminal-heading">Certificates &amp; Courses</div>
        <ul>
          <li>ISTQB® Certified Tester Foundation Level</li>
          <li>CKA &amp; CKAD</li>
        </ul>

        <div className="terminal-heading">Professional Qualifications</div>
        <ul>
          <li>
            E.13 – Designing local computer networks and network administration
          </li>
          <li>
            E.15 – Commissioning and maintaining terminals and subscriber
            connections
          </li>
          <li>E.16 – Installation and maintenance of wide area networks</li>
          <li>
            <strong>Profession:</strong> ICT Technician (351103)
          </li>
        </ul>
      </>
    ),
    homelab: (
      <>
        <div className="terminal-heading">Current Hardware</div>
        <div className="terminal-command-output">
          <p>
            <span className="highlight">
              <strong>Host:</strong>
            </span>{" "}
            HP EliteDesk 705 G4 DM 65W (DBXEnabled)
          </p>
          <p>
            <span className="highlight">
              <strong>Router:</strong>
            </span>{" "}
            Asus RT-AC65P (flashed with OpenWRT)
          </p>
          <p>
            <span className="highlight">
              <strong>OS:</strong>
            </span>{" "}
            Proxmox VE bookworm 8.3.4 x86_64
          </p>
          <p>
            <span className="highlight">
              <strong>CPU:</strong>
            </span>{" "}
            AMD Ryzen 3 PRO 2200G @ 3.50 GHz
          </p>
          <p>
            <span className="highlight">
              <strong>GPU:</strong>
            </span>{" "}
            AMD Radeon Vega 8 Graphics (Integrated)
          </p>
          <p>
            <span className="highlight">
              <strong>Memory:</strong>
            </span>{" "}
            32GiB
          </p>
        </div>
    
        <div className="terminal-heading">Router Services</div>
        <div className="terminal-command-output">
          <ul>
            <li>
              <span className="highlight">
                <strong>ds-lite</strong>
              </span>{" "}
              - Dual-Stack Lite for IPv6 transition
            </li>
            <li>
              <span className="highlight">
                <strong>tailscale</strong>
              </span>{" "}
              - Secure VPN and mesh networking
            </li>
            <li>
              <span className="highlight">
                <strong>cloudflared</strong>
              </span>{" "}
              - Secure tunnel for remote access and DNS over HTTPS
            </li>
          </ul>
        </div>
    
        <div className="terminal-heading">Services in Use</div>
        <div className="terminal-command-output">
          <ul>
            <li>
              <span className="highlight">
                <strong>Docker Containers:</strong>
              </span>
              <ul>
                <li>
                  <span className="highlight">
                    <strong>{glow("This site!")}</strong>
                  </span>{" "}
                  - I doubt it you won't believe it.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Crafty</strong>
                  </span>{" "}
                  - A Minecraft server management tool for managing Minecraft
                  instances.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Planning Poker</strong>
                  </span>{" "}
                  - A collaborative tool for agile planning, allowing teams to
                  estimate effort or complexity.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Prowlarr</strong>
                  </span>{" "}
                  - Indexer manager for managing and automating search for TV
                  shows and movies.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Flaresolverr</strong>
                  </span>{" "}
                  - A service for bypassing Cloudflare protection for web
                  scraping or automating tasks.
                </li>
                <li>
                  <span className="highlight">
                    <strong>qBittorrent</strong>
                  </span>{" "}
                  - A popular, open-source torrent client for downloading and
                  sharing files.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Radarr</strong>
                  </span>{" "}
                  - A tool for automating the management and downloading of
                  movies.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Sonarr</strong>
                  </span>{" "}
                  - A similar tool to Radarr, but for automating the management
                  of TV series.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Jellyseerr</strong>
                  </span>{" "}
                  - A self-hosted media server management tool built for Jellyfin
                  that allows users to request media.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Bazarr</strong>
                  </span>{" "}
                  - A companion app to Sonarr and Radarr that handles subtitle
                  downloading and management.
                </li>
                <li>
                  <span className="highlight">
                    <strong>Jackett</strong>
                  </span>{" "}
                  - A tool that helps with connecting various torrent trackers to
                  Radarr, Sonarr, and other tools for better search
                  functionality.
                </li>
              </ul>
            </li>
            <li>
              <span className="highlight">
                <strong>Jellyfin</strong>
              </span>{" "}
              - Mom can we get Netflix at home? Netflix at home:
            </li>
            <li>
              <span className="highlight">
                <strong>GitHub Actions Self-hosted Runner</strong>
              </span>{" "}
              - CI/CD integration
            </li>
            <li>
              <span className="highlight">
                <strong>AdGuard Home</strong>
              </span>{" "}
              - Network-wide ad blocker
            </li>
            <li>
              <span className="highlight">
                <strong>HomeAssistant</strong>
              </span>{" "}
              (with ESPHome, Z2M, and BLE) - Home automation
            </li>
          </ul>
        </div>
      </>
    ),
    
    experience: (
      <>
        <div className="terminal-heading">Work Experience</div>
        <ul>
          <li>
            <strong>Associate QA Engineer</strong> – Kainos for DVSA (10/2024 - Present)
            <br />• Implementing Playwright for mobile emulation and E2E testing on physical Android devices.
            <br />• Supporting the team in developing and executing automated end-to-end tests.
            <br />• Ensuring high-quality test environments for both emulation and real-device testing.
            <br />• Collaborating with developers to enhance test automation and coverage.
            <br />• Contributing to the overall test strategy and improving testing workflows.
            <br />
            <strong>Projects:</strong>
            <ul>
              <li>
                <strong>DVSA: Images in Garages</strong> – Implementing image evidence within MOT garages to combat fraud and errors.  
                <a href="https://mattersoftesting.blog.gov.uk/how-were-combating-fraud-and-error-within-the-mot/">Read more</a>
              </li>
              <li>
                <strong>DVSA: Trade-API</strong> – Complete rewrite of the Java MOT History service to TypeScript with full API test coverage.
              </li>
              <li>
                <strong>DVSA: FMTS</strong> – Modernizing the MOT Testing System (MTS) with improved automation, stability, and scalability.
              </li>
            </ul>
          </li>
          <li>
            <strong>Trainee QA Engineer</strong> – Kainos for DVSA (06/2023 - 10/2024)
            <br />• Implemented test platforms and prepared test environments.
            <br />• Conducted manual API testing and analyzed results.
            <br />• Wrote and executed Playwright E2E tests (TypeScript) and performance tests (Scala Gatling).
            <br />• Responded to user tickets and demoed solutions to stakeholders.
          </li>
          <li>
            <strong>LAB Support Technician</strong> – ManpowerGroup for Intel (10/2021 - 06/2023)
            <br />• Led project support initiatives and provided technical assistance.
            <br />• Managed IT infrastructure, troubleshooting hardware and software issues.
            <br />• Coordinated system deployments, updates, and technical improvements.
            <br />• Prepared and maintained test environments, performed acceptance testing.
            <br />• Analyzed system diagrams and contributed to process optimization.
            <br />• Provided technical support and troubleshooting for platform users.
            <br />
            <strong>Projects:</strong>
            <ul>
              <li>
                <strong>MTL-P & MTL-S</strong> – Lead support for next-generation Intel platforms.
              </li>
            </ul>
          </li>
          <li>
            <strong>Area Sales Manager</strong> – Liquider Poland (07/2020 - 09/2021)
            <br />• Managed a team of 20 and supported regional IT infrastructure.
            <br />• Led multiple Customer Representatives and Brand Ambassadors.
          </li>
        </ul>
      </>
    ),    
    runescape: (
      <div>
      </div>
    ),
  };

  const processCommand = async (input: string) => {
    const commandRecord = (
      <div
        ref={(el) => (scrollRef.current = el)}
        className="terminal-command-record"
      >
        <span className="terminal-prompt">{terminalPrompt}</span>{" "}
        <span>{input}</span>
      </div>
    );
  
    if (input.trim()) {
      setHistory([...history, input]);
      setHistoryIndex(history.length + 1);
    }
  
    const inputCommand = input.toLowerCase();
    if (!isValidCommand(inputCommand)) {
      setOutput([
        ...output,
        commandRecord,
        <div className="terminal-command-output">
          <ErrorMessage command={inputCommand} />
        </div>,
      ]);
    } else if (isEchoCommand(inputCommand)) {
      if (inputCommand === "runescape") {
        const username = "To-chek";
        const statsData = await fetchOSRSStats(username);
        if (statsData) {
          const parsedStats = parseOSRSStats(statsData);
          setOutput([
            ...output,
            commandRecord,
            <div className="terminal-command-output">
              <p>
                {glow("You must have been really bored if you tried that 🎉")}, I've been a RuneScape player for a little bit over{" "}
                {getAge(new Date(2004, 1, 1))} years. Who would even believe that? In numbers:
              </p>
              <ul>
                <li>7th account</li>
                <li>6 bans total (I'm not proud of them at all)</li>
                <li>My first {glow("Quest Cape")}</li>
              </ul>
              <p>As you went sooo far, you can check my stats (btw they are fetched from highscores):</p>
              <ul>
                {parsedStats.map((stat) => (
                  <li key={stat.name}>
                    <strong>{stat.name}:</strong> Level {stat.level} (XP:{" "}
                    {stat.experience.toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>,
          ]);
        } else {
          setOutput([
            ...output,
            commandRecord,
            <div className="terminal-command-output">
              <ErrorMessage command="Failed to fetch OSRS stats. Please try again later." />
            </div>,
          ]);
        }
      } else {
        setOutput([
          ...output,
          commandRecord,
          <div className="terminal-command-output">
            {commands[inputCommand]}
          </div>,
        ]);
      }
    } else if (isUtilityCommand(inputCommand)) {
      switch (inputCommand) {
        case "clear": {
          setOutput([]);
          break;
        }
        case "ls -la": {
          const allCommandsOutput = [
            "help",
            "whoami",
            "experience",
            "skills",
            "projects",
            "homelab",
            "github",
            "contact",
          ].map((command) => (
            <>
              <div className="terminal-heading">{command}</div>
              <div className="terminal-command-output">
                {commands[command as EchoCommand]}
              </div>
            </>
          ));
  
          setOutput([commandRecord, ...allCommandsOutput]);
          break;
        }
        case "cv": {
          setOutput([...output, commandRecord]);
          downloadFile("CV.pdf", "Toczek Tomasz - Curriculum Vitae.pdf");
          break;
        }
      }
    }
  };

  const getHistory = (direction: "up" | "down") => {
    let updatedIndex;
    if (direction === "up") {
      updatedIndex = historyIndex === 0 ? 0 : historyIndex - 1;
    } else {
      updatedIndex =
        historyIndex === history.length ? history.length : historyIndex + 1;
    }
    setHistoryIndex(updatedIndex);
    return updatedIndex === history.length ? "" : history[updatedIndex];
  };

  const getAutocomplete = (input: string) => {
    const matchingCommands = allCommands.filter((c) => c.startsWith(input));
    if (matchingCommands.length === 1) {
      return matchingCommands[0];
    } else {
      const commandRecord = (
        <div
          ref={(el) => (scrollRef.current = el)}
          className="terminal-command-record"
        >
          <span className="terminal-prompt">{terminalPrompt}</span>{" "}
          <span>{input}</span>
        </div>
      );
      setOutput([...output, commandRecord, matchingCommands.join("    ")]);
      return input;
    }
  };

  const focusOnInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
    }
    inputRef.current?.focus();
  };

  return (
    <div className="terminal-container" tabIndex={-1} onKeyDown={focusOnInput}>
      <div className="terminal-content">
        {banner && <Banner banner={banner} />}
        {welcomeMessage && (
          <WelcomeMessage message={welcomeMessage} inputRef={inputRef} />
        )}
        <TerminalOutput outputs={output} />
        <InputArea
          setOutput={setOutput}
          processCommand={processCommand}
          getHistory={getHistory}
          getAutocomplete={getAutocomplete}
          inputRef={inputRef}
          terminalPrompt={terminalPrompt}
        />
      </div>
    </div>
  );
};

export default Terminal;