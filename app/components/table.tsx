import { useState } from "react";
import TableHeadCell from "~/components/table-head-cell";
import TableDataCell, { Colors } from "~/components/table-data-cell";
import useWindowDimensions from "~/hooks/useWindowDimensions";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoints = keyof typeof breakpoints;

const className = {
  table: "w-full table-auto select-none shadow",
  tableHeader:
    "select-none bg-primary-dark text-xs lg:text-sm font-bold lg:font-black text-black/50 dark:bg-dark dark:text-white/50 lowercase",
  sortIcon: "absolute -right-3 top-[2px] h-3 w-3",
  tableBody: "text-center text-sm text-black dark:text-white",
  tableBodyRow:
    "group border-b border-solid border-black/5 bg-primary transition-colors hover:bg-primary-dark dark:border-white/5 dark:bg-dark/50 dark:hover:bg-dark/60",
};

export type HeaderDef = {
  key: string;
  label: string;
  shortLabel?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  minWidth?: Breakpoints;
};

export type DataDef = {
  key: string;
  value?: string | number;
  element?: React.ReactNode;
  align?: "left" | "center" | "right";
  fullWidth?: boolean;
  bold?: boolean;
  tooltipText?: string;
  className?: string;
};

export type SpecialRow = {
  type: string;
  label: string;
  color: Colors;
  positions: number[];
}

type TableProps = {
  headers: HeaderDef[];
  data: DataDef[][];
  specialRows?: SpecialRow[];
};

const sortFn =
  (sortColumnIdx: number, sortColumnOrder: "asc" | "desc") =>
    (rowA: DataDef[], rowB: DataDef[]) => {
      const [colA, colB] =
        sortColumnOrder === "asc"
          ? [rowA[sortColumnIdx!], rowB[sortColumnIdx!]]
          : [rowB[sortColumnIdx!], rowA[sortColumnIdx!]];

      const [valueA, valueB] = [colA.value, colB.value];

      if (valueA === undefined || valueB === undefined) return 0;

      if ([valueA, valueB].every((value) => typeof value === "string")) {
        return (valueA as string).localeCompare(valueB as string);
      }

      return (valueA as number) - (valueB as number);
    };

export default function Table({ headers, data, specialRows }: TableProps) {
  const [sortColumnIdx, setSortColumnIdx] = useState<number | null>(null);
  const [sortColumnOrder, setSortColumnOrder] = useState<"asc" | "desc" | null>(
    "asc"
  );

  const isSorting = sortColumnIdx !== null;

  const sortColumn = (colIdx: number) => {
    if (colIdx === sortColumnIdx) {
      const orders: ("asc" | "desc" | null)[] = ["desc", "asc", null];
      const nextOrderIdx =
        (orders.findIndex((order) => order === sortColumnOrder) + 1) %
        orders.length;
      const nextOrder = orders[nextOrderIdx];

      if (nextOrder === null) setSortColumnIdx(null);

      setSortColumnOrder(nextOrder);
      return;
    }

    setSortColumnIdx(colIdx);
    setSortColumnOrder("desc");
  };

  const specialRowsArray: { label: string; color: Colors }[] = specialRows ? Array.from({
    length: 20,
    ...Object.fromEntries(
      specialRows
        .map((spot) =>
          spot.positions.map((pos) => [
            pos,
            { color: spot.color, label: spot.label },
          ])
        )
        .flat()
    ),
  }) : [];

  const { width } = useWindowDimensions();

  const isHidden = (header: HeaderDef) => header.minWidth !== undefined && width <= breakpoints[header.minWidth];

  return (
    <table className={className.table}>
      <thead className={className.tableHeader}>
        <tr>
          {headers.map((header, headerIdx) => (
            <TableHeadCell
              key={header.key}
              label={header.label}
              shortLabel={header.shortLabel}
              align={header.align as "left" | "center" | "right"}
              isSorting={headerIdx === sortColumnIdx}
              isTopLeftCell={headerIdx === 0}
              isTopRightCell={headerIdx === headers.length - 1}
              onClick={[undefined, true].includes(header.sortable) ? () => sortColumn(headerIdx) : undefined}
              sortColumnOrder={sortColumnOrder}
              sortable={header.sortable}
              hidden={isHidden(header)}
            />
          ))}
        </tr>
      </thead>
      <tbody className={className.tableBody}>
        {(isSorting
          ? [...data].sort(sortFn(sortColumnIdx!, sortColumnOrder!))
          : data
        ).map((row, rowIdx) => (
          <tr className={className.tableBodyRow} key={row[0].value}>
            {row.map((col, colIdx) => (
              <TableDataCell
                key={col.key}
                value={col.value}
                element={col.element}
                bold={col.bold}
                align={col.align}
                fullWidth={col.fullWidth}
                isHighlighted={sortColumnIdx === colIdx}
                tooltipText={col.tooltipText || specialRowsArray[rowIdx]?.label}
                className={col.className}
                color={specialRowsArray[rowIdx]?.color}
                hidden={isHidden(headers[colIdx])}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
