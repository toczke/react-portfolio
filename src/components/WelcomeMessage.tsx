import React, { useEffect } from "react";

type WelcomeMessageProps = {
  message: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

const WelcomeMessage = (props: WelcomeMessageProps) => {
  const welcomeMessageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.inputRef.current) {
      props.inputRef.current.disabled = true;
    }

    let index = 0;
    const typeText = setInterval(() => {
      if (!welcomeMessageRef.current) {
        return;
      }

      // Update the inner text directly, simulating typing
      welcomeMessageRef.current.textContent = props.message.substring(0, index + 1);

      index++;

      if (index === props.message.length) {
        clearInterval(typeText);
        if (props.inputRef.current) {
          props.inputRef.current.disabled = false;
          props.inputRef.current.focus();
        }
      }
    }, 20);

    return () => {
      clearInterval(typeText); // Cleanup interval on unmount or change
    };
  }, [props.inputRef, props.message]);

  return (
    <div ref={welcomeMessageRef} className="terminal-welcome-message"></div>
  );
};

export default WelcomeMessage;
