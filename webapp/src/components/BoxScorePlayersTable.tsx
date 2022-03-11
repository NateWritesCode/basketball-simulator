import {
  Box,
  Flex,
  Link,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Image,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useSortBy, useTable } from "react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { getTextTransform, secondsToMinutes } from "../utility";
import numeral from "numeral";
import { startGameSim_startGameSim_playerStats } from "../types/startGameSim";

interface IBoxScorePlayersTableProps {
  data: any;
}

const FooterTotalSum = (props: any) => {
  const total = React.useMemo(
    () =>
      props.rows.reduce(
        (sum: any, row: any) => row.values[props.column.id] + sum,
        0
      ),
    [props.rows]
  );

  return (
    <Box as="span" fontWeight={"bold"}>
      {total}
    </Box>
  );
};

const FooterTotalAvg = (props: any) => {
  const total = React.useMemo(
    () =>
      props.rows.reduce((sum: any, row: any) => {
        return row.values[props.column.id] + sum;
      }, 0),
    [props.rows]
  );

  //TODO: This should only be players who played
  return (
    <Box as="span" fontWeight={"bold"}>
      {numeral(total / props.rows.length).format("0.0")}
    </Box>
  );
};

const FooterTotalText = () => {
  return (
    <Box as="span" fontWeight={"bold"}>
      TOTALS
    </Box>
  );
};

const FooterBlank = () => {
  return <></>;
};

const BoxScorePlayersTable = (props: IBoxScorePlayersTableProps) => {
  const data = useMemo(
    () =>
      props.data.map((obj: startGameSim_startGameSim_playerStats) => {
        return {
          ...obj,
          "fg%": (obj.fgm / obj.fga) * 100,
          "tp%": (obj.tpm / obj.tpa) * 100,
          "ft%": (obj.ftm / obj.fta) * 100,
          reb: obj.orb + obj.drb,
        };
      }),
    []
  );

  console.log("props", props);

  const columns = useMemo(
    () => [
      {
        Footer: FooterTotalText,
        Header: "Player",
        accessor: "name",
        Cell: (props: any) => {
          const rowIndex = props.row.index;
          const entity = data[rowIndex];
          return (
            <Flex>
              <Image
                h={19}
                w={26}
                alt={entity.name}
                src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${entity.id}.png`}
              />
              <Link
                href={`/player/${entity.slug}`}
                color="blue.500"
                ml={2}
                isExternal
              >
                {entity.name}
              </Link>
              <Box as="span" ml={1}>
                {getTextTransform("positionAbbrev", entity.position)}
              </Box>
            </Flex>
          );
        },
      },
      {
        Header: "MIN",
        accessor: "timePlayed",
        Footer: FooterBlank,
        Cell: (props: any) => {
          return <>{props.value ? secondsToMinutes(props.value) : "DNP"}</>;
        },
      },
      {
        Header: "FGM",
        accessor: "fgm",
        Footer: FooterTotalSum,
      },
      {
        Header: "FGA",
        accessor: "fga",
        Footer: FooterTotalSum,
      },
      {
        accessor: "fg%",
        Header: "FG%",
        Cell: (props: any) => {
          return <>{numeral(props.value).format("0.0")}</>;
        },
        Footer: FooterTotalAvg,
      },
      { Header: "3PM", accessor: "tpm", Footer: FooterTotalSum },
      { Header: "3PA", accessor: "tpa", Footer: FooterTotalSum },
      {
        accessor: "tp%",
        Header: "3P%",
        Cell: (props: any) => {
          return <>{numeral(props.value).format("0.0")}</>;
        },
        Footer: FooterTotalAvg,
      },
      { Header: "FTM", accessor: "ftm", Footer: FooterTotalSum },
      { Header: "FTA", accessor: "fta", Footer: FooterTotalSum },
      {
        accessor: "ft%",
        Header: "FT%",
        Cell: (props: any) => {
          return <>{numeral(props.value).format("0.0")}</>;
        },
        Footer: FooterTotalAvg,
      },
      {
        accessor: "orb",
        Header: "OREB",
        Footer: FooterTotalSum,
      },
      {
        accessor: "drb",
        Header: "DREB",
        Footer: FooterTotalSum,
      },
      {
        accessor: "reb",
        Header: "REB",
        Footer: FooterTotalSum,
      },
      {
        accessor: "ast",
        Header: "AST",
        Footer: FooterTotalSum,
      },
      {
        accessor: "stl",
        Header: "STL",
        Footer: FooterTotalSum,
      },
      {
        accessor: "blk",
        Header: "BLK",
        Footer: FooterTotalSum,
      },
      {
        accessor: "tov",
        Header: "TO",
        Footer: FooterTotalSum,
      },
      {
        accessor: "fouls",
        Header: "PF",
        Footer: FooterTotalSum,
      },
      { Header: "PTS", accessor: "pts", Footer: FooterTotalSum },
      { Header: "+/-", accessor: "plusMinus", Footer: FooterTotalAvg },
    ],
    []
  );
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "timePlayed",
            desc: true,
          },
          {
            id: "pts",
            desc: true,
          },
        ],
      },
    },
    useSortBy
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    footerGroups,
  } = tableInstance;

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <Box as="span" ml={1}>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon w={2} h={2} />
                    ) : (
                      <TriangleUpIcon w={2} h={2} />
                    )
                  ) : (
                    ""
                  )}
                </Box>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>;
              })}
            </Tr>
          );
        })}
      </Tbody>
      <Tfoot>
        {footerGroups.map((group) => (
          <Tr {...group.getFooterGroupProps()}>
            {group.headers.map((column) => (
              <Td {...column.getFooterProps()}>{column.render("Footer")}</Td>
            ))}
          </Tr>
        ))}
      </Tfoot>
    </Table>
  );
};

export default BoxScorePlayersTable;
