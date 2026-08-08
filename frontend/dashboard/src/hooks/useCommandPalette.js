import {
  useEffect,
  useState
} from "react";

export default function useCommandPalette() {

  const [open, setOpen] =
    useState(false);

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          event.ctrlKey &&
          event.key === "k"
        ) {

          event.preventDefault();

          setOpen(true);

        }

      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, []);

  return {
    open,
    setOpen
  };
}