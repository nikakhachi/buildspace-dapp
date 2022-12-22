import { Paper, Table, TableCell, TableBody, TableRow, TableHead, TableContainer } from "@mui/material";
import React from "react";
import moment from "moment";
import { Wave } from "../types";

interface IProps {
  waves: Wave[];
}

export const WaveTable: React.FC<IProps> = ({ waves }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} size="small">
        <TableHead sx={{ background: "lightgray" }}>
          <TableRow>
            <TableCell>
              <strong>Sender</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Date</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Message</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {waves.map((wave) => (
            <TableRow key={wave.timestamp}>
              <TableCell sx={{ background: "rgba(0,0,0,0.4)", color: "white" }} component="th" scope="row">
                {wave.waver}
              </TableCell>
              <TableCell sx={{ background: "rgba(0,0,0,0)", borderRight: "1px solid rgba(0,0,0,0.1)" }} align="right">
                {moment.unix(wave.timestamp).format("DD/MM/YYYY h:mma")}
              </TableCell>
              <TableCell sx={{ background: "rgba(0,0,0,0)" }} align="right">
                {wave.message}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
