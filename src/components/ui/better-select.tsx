import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useMemo,
} from "react";
import {
  Check,
  ChevronDown,
  X,
  Search,
  Loader2,
  AlertCircle,
  MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import Fuse from "fuse.js";
import { normalizeText } from "@/utils/normalizeText";

export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface SelectProps {
  options: Option[];
  selectedOptions: Option[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  onChange?: (prevOptions: Option[], currentOptions: Option[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  loading?: boolean;
  error?: unknown;
  required?: boolean;
  label?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  disabledMessage?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
  onChange,
  multiple = false,
  searchable = true,
  loading = false,
  error = false,
  required = false,
  label,
  emptyMessage = "No options available",
  noResultsMessage = "No results found",
  disabledMessage = "Unavailable",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const normalizedOptions = options.map((option) => ({
    ...option,
    label: normalizeText(option.label),
    value: option.value,
  }));

  const fuse = useMemo(() => {
    const fuseOptions = {
      keys: ["label", "value"],
      threshold: 0.3,
      minMatchCharLength: 1,
      ignoreLocation: true,
    };
    return new Fuse(normalizedOptions, fuseOptions);
  }, [normalizedOptions]);

  const handleOptionClick = (option: Option | undefined) => {
    if (!option || option.disabled) return;

    const prevSelectedOptions = [...selectedOptions];
    let newSelectedOptions: Option[];

    if (multiple) {
      const isSelected = selectedOptions.some((o) => o.value === option.value);
      newSelectedOptions = isSelected
        ? selectedOptions.filter((o) => o.value !== option.value) // Deselect option
        : [...selectedOptions, option]; // Select option
    } else {
      // Deselect the option if it's already selected, otherwise select it
      newSelectedOptions =
        prevSelectedOptions[0]?.value === option.value ? [] : [option];
    }

    // Call onChange with previous and current selected options
    if (onChange) {
      onChange(prevSelectedOptions, newSelectedOptions);
    }

    // Update selected options
    setSelectedOptions(newSelectedOptions);

    // Close dropdown for single select
    if (!multiple) {
      closeDropdown();
    }
  };

  const handleRemoveSelectedOption = (
    option: Option,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    const newSelectedOptions = selectedOptions.filter(
      (o) => o.value !== option.value
    );
    setSelectedOptions(newSelectedOptions);
  };

  const filteredOptions = search.trim()
    ? fuse
        .search(search)
        .map((result) => {
          // Return the original option from the `options` array
          const option = options.find((opt) => opt.value === result.item.value);
          return option;
        })
        .filter((option): option is Option => option !== undefined)
    : options;

  // Scroll to first selected option when dropdown opens
  useEffect(() => {
    if (open && optionsRef.current && !initialScrollDone) {
      // Find the index of the first selected option in filtered options
      const firstSelectedIndex = filteredOptions.findIndex((option) =>
        selectedOptions.some((selected) => selected.value === option.value)
      );

      if (firstSelectedIndex !== -1) {
        const optionElements = optionsRef.current.children;
        const targetElement = optionElements[firstSelectedIndex] as HTMLElement;

        if (targetElement) {
          targetElement.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
          setFocusedIndex(firstSelectedIndex);
          setInitialScrollDone(true);
        }
      }
    }
  }, [open, selectedOptions, filteredOptions, initialScrollDone]);

  // Reset initial scroll when dropdown closes
  useEffect(() => {
    if (!open) {
      setInitialScrollDone(false);
    }
  }, [open]);

  // Determine dropdown positioning
  useEffect(() => {
    if (open && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      const dropdownHeight = 240; // Approximate height of dropdown (max-h-60 is 15rem = 240px)

      if (spaceBelow >= dropdownHeight) {
        setDropdownPosition("bottom");
      } else if (spaceAbove >= dropdownHeight) {
        setDropdownPosition("top");
      } else {
        // If neither space is sufficient, default to bottom
        setDropdownPosition("bottom");
      }
    }
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      // When search is performed, always set focus to the first result
      if (search.trim() && filteredOptions.length > 0) {
        setFocusedIndex((prevIndex) =>
          prevIndex < 0 || prevIndex >= filteredOptions.length ? 0 : prevIndex
        );
      }
    }
  }, [open, search, filteredOptions]);

  useEffect(() => {
    if (optionsRef.current) {
      const focusedOption = optionsRef.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedOption && isKeyboardNav) {
        focusedOption.scrollIntoView({ block: "nearest", inline: "start" });
      }
    }
  }, [focusedIndex, isKeyboardNav]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsKeyboardNav(true);
      setFocusedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsKeyboardNav(true);
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (filteredOptions.length > 0) {
        const indexToSelect = focusedIndex;
        const option = filteredOptions[indexToSelect];
        if (option) {
          handleOptionClick(option);
        }
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    setFocusedIndex(-1);
    setSearch("");
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-start w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer"
        )}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            multiple ? (
              selectedOptions.map((o) => (
                <Badge
                  key={o.value}
                  variant="outline"
                  className="flex items-center cursor-pointer"
                  onClick={(event) => handleRemoveSelectedOption(o, event)}
                >
                  {o.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span>{selectedOptions[0].label}</span>
            )
          ) : (
            `Select ${label ? label : "options"}`
          )}
        </div>
        {error ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                Error loading {label ? label : "options"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : loading ? (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <ChevronDown className="h-4 w-4 opacity-50" />
        )}
      </button>
      {open && !loading && !error && (
        <DismissableLayer>
          <div
            className={cn(
              "absolute z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden",
              "animate-in fade-in-10 duration-200 ease-out",
              dropdownPosition === "bottom"
                ? "mt-2 slide-in-from-top-1"
                : "mb-2 slide-in-from-bottom-1",
              dropdownPosition === "bottom" ? "top-full" : "bottom-full"
            )}
          >
            {searchable && (
              <div className="sticky top-0 z-10 bg-background p-2 flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 pl-10 text-sm outline-none placeholder:text-muted-foreground"
                  ref={inputRef}
                />
              </div>
            )}
            <div className="border-t"></div>
            <div className="p-1 max-h-60 overflow-y-auto" ref={optionsRef}>
              {options.length === 0 ? (
                <div className="p-2 text-center text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-2 text-center text-muted-foreground">
                  {noResultsMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => {
                      if (!option.disabled) {
                        setFocusedIndex(index);
                        setIsKeyboardNav(false);
                      }
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm",
                      option.disabled
                        ? "text-muted-foreground cursor-not-allowed opacity-50"
                        : "hover:bg-accent hover:text-accent-foreground",
                      (isKeyboardNav || (search.trim() && index === 0)) &&
                        index === focusedIndex &&
                        "bg-accent text-accent-foreground",
                      option.disabled && "cursor-not-allowed"
                    )}
                  >
                    {selectedOptions.some((o) => o.value === option.value) && (
                      <Check className="absolute left-2 h-4 w-4" />
                    )}
                    {option.label}
                    {option.disabled && (
                      <Badge variant={"outline"} className="ml-2">
                        {disabledMessage}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
};

export default Select;
