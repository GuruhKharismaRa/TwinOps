import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  ClipboardList,
  Truck,
  Users,
  Shield,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useDebounce } from "use-debounce";

import {
  useNavigate,
} from "react-router-dom";

import {
  search,
} from "@/services/searchService";

import { Loader2, Search } from "lucide-react";
export default function CommandPalette() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const down = (e) => {

      if (
        e.key === "k" &&
        (e.metaKey || e.ctrlKey)
      ) {

        e.preventDefault();

        setOpen(
          (open) => !open
        );

      }

      if (
        e.key === "Escape"
      ) {

        setOpen(false);

      }

    };

    document.addEventListener(
      "keydown",
      down
    );

    return () =>
      document.removeEventListener(
        "keydown",
        down
      );

  }, []);

  useEffect(() => {

    if (debouncedQuery.length < 2) {
      setResults([]);
      return;

    }

    loadResults();

  }, [debouncedQuery]);

  async function loadResults() {

    try {
      setLoading(true);
      const start = Date.now();

      const response = await search(debouncedQuery);

      const elapsed =
            Date.now() - start;

      if (elapsed < 300) {

            await new Promise(
            resolve =>
            setTimeout(
                  resolve,
                  300 - elapsed
            )
            );

      }
      // const response = await search(debouncedQuery);
      
      console.log(
        "SEARCH RESULT",
        response
      );

      if (response.status === "success") {
        setResults(
          response.data || []
        );

      }

    } catch (error) {

      console.error(error);

    } finally {
      setLoading(false);
    }

  }

  function getIcon(type) {

    switch (type) {

      case "MENU":
        return (
          <LayoutDashboard
            className="size-4"
          />
        );

      case "WAREHOUSE":
        return (
          <Warehouse
            className="size-4"
          />
        );

      case "INVENTORY":
        return (
          <Boxes
            className="size-4"
          />
        );

      case "TASK":
        return (
          <ClipboardList
            className="size-4"
          />
        );

      case "FORKLIFT":
        return (
          <Truck
            className="size-4"
          />
        );

      case "USER":
        return (
          <Users
            className="size-4"
          />
        );

      default:
        return (
          <Shield
            className="size-4"
          />
        );

    }

  }

  const groupedResults =
    results.reduce(
      (acc, item) => {

        if (
          !acc[item.entity_type]
        ) {

          acc[item.entity_type] = [];

        }

        acc[item.entity_type]
          .push(item);

        return acc;

      },
      {}
    );
//     console.log(
//   "RESULTS",
//   results
// );

// console.log(
//   "GROUPED",
//   groupedResults
// );
  return (

    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="
        sm:max-w-[560px]
        p-0
        overflow-hidden
        rounded-2xl
        shadow-2xl
        border
      "
    >

      {/* Header */}

      <div
        className="
          px-4
          py-3
          border-b
          bg-muted/30
        "
      >

        <div
          className="
            font-semibold
            text-sm
          "
        >
          TwinOps Search
        </div>

        <div
          className="
            text-xs
            text-muted-foreground
          "
        >
          Search warehouse, task,
          inventory, forklift and more
        </div>

      </div>

      <Command>

        <div className="px-2 py-0 relative">

          <CommandInput placeholder="Search warehouse, task, bin..."
            value={query}
            onValueChange={setQuery}
            className="
              h-7

              font-medium
              border-0
              shadow-none
              focus:ring-0
              text-base"/>

        </div>

        <CommandList
          className="
            min-h-[150px]
            max-h-[300px]
          "
        >
            {results.length > 0 && (
  <div
    className="
      mx-3
      px-0
      py-2
      text-xs
      font-medium
      text-muted-foreground
      border-b
    "
  >
    {results.length} result{results.length > 1 ? "s" : ""} found
  </div>
)}
            {/* {loading && (<div className="p-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin"/>Loading...</div>)} */}
                  {loading && (
  <div className="p-2 space-y-2">

    <div className="h-10 rounded bg-muted animate-pulse" />
    <div className="h-10 rounded bg-muted animate-pulse" />
    <div className="h-10 rounded bg-muted animate-pulse" />

  </div>
)}

          <CommandEmpty>

            <div className="flex flex-col items-center gap-2 py-4">
              <div className="text-xl">
                🔍
              </div>

              <div>
                No results found
              </div>

            </div>

          </CommandEmpty>

          {

            Object.entries(
              groupedResults
            ).map(
              ([type, items]) => (

                <CommandGroup
                  key={type}
                  heading={type}
                >

                  {

                    items.map(
                      (item) => (

                        <CommandItem
                          key={item.url}
                          value={item.entity_name}
                          className="mx-2 my-1 rounded-lg py-2.5 transition-all hover:bg-muted rounded-lg cursor-pointer  font-['Geist']"
                          onSelect={() => {
                            navigate(item.url);
                            setOpen(false);
                          }}
                        >

                          {
                            getIcon(type)
                          }

                          {/* <span className="font-medium">
                            {
                              item.entity_name
                            }
                          </span> */}
                          <div className="flex flex-col font-medium">
                              <span>{item.entity_name}</span>
                              <span className="text-xs text-muted-foreground">
                              {item.url}
                              </span>
                          </div>

                        </CommandItem>

                      )
                    )

                  }

                </CommandGroup>

              )
            )

          }

        </CommandList>

      </Command>

      {/* Footer */}

      <div
        className="
          border-t
          px-4
          py-1.5
          text-xs
          text-muted-foreground
          flex
          justify-between
        "
      >

        <span>
          ESC Close
        </span>

        <span>
          ↑↓ Navigate
        </span>

        <span>
          Enter Open
        </span>

      </div>

    </CommandDialog>

  );

}