import React from "react";
import { SindromuSkalaMeitenesSkolotaji25, DSMSkalaMeitenesSkolotaji25 } from "./graphs/MeitenesSkolotaji25";
import { SindromuSkalaZeniSkolotaji25, DSMSkalaZeniSkolotaji25 } from "./graphs/ZeniSkolotaji25";
import { DSMSkalaZeniSkolotaji611, SindromuSkalaZeniSkolotaji611 } from "./graphs/ZeniSkolotaji611";
import { DSMSkalaZeni611, SindromuSkalaZeni611, DSMSkalaMeitenes611, SindromuSkalaMeitenes611 } from "./graphs/Zeni611";

export const questionSets = {
  "aseba_pirmsskolas.txt": {
    name: "(Skolotājiem) ASEBA jautājum pirmsskolas vecumam",
    scales: [SindromuSkalaMeitenesSkolotaji25, DSMSkalaMeitenesSkolotaji25,
      SindromuSkalaZeniSkolotaji25, DSMSkalaZeniSkolotaji25]
  },

  "aseba_skolasjautajumi.txt": {
    name: "ASEBA jautājumi skolas vecuma bērniem",
    scales: [DSMSkalaZeni611, SindromuSkalaZeni611, DSMSkalaMeitenes611, SindromuSkalaMeitenes611]
  },

  "aseba_skolasjautajumiskolotajiem.txt": {
    name: "(Skolotājiem) ASEBA jautājumi skolas vecuma bērniem",
    scales: [DSMSkalaZeniSkolotaji611, SindromuSkalaZeniSkolotaji611]
  },

  "pirmsskolas_jautajumu_anketa.txt": {
    name: "Pirmsskolas vecuma bērnu jautājumu anketa",
    scales: []
  },
}
