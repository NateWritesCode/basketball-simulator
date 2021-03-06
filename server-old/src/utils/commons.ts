const commons: any = {
  BOS: ["ATL", "IND", "MIL", "ORL", "CHI", "CLE", "DET", "CHA", "MIA", "WAS"],
  BKN: ["CLE", "ORL", "DET", "MIA", "CHI", "IND", "MIL", "ATL", "CHA", "WAS"],
  NYK: ["MIA", "MIL", "CHA", "CHI", "CLE", "DET", "IND", "ATL", "ORL", "WAS"],
  PHI: ["CHA", "DET", "CLE", "WAS", "CHI", "IND", "MIL", "ATL", "MIA", "ORL"],
  TOR: ["CHI", "WAS", "ATL", "IND", "CLE", "DET", "MIL", "CHA", "MIA", "ORL"],
  CHI: ["CHA", "NYK", "TOR", "MIA", "BOS", "BKN", "PHI", "ATL", "ORL", "WAS"],
  CLE: ["PHI", "WAS", "BKN", "ORL", "BOS", "NYK", "TOR", "ATL", "CHA", "MIA"],
  DET: ["ATL", "BKN", "PHI", "WAS", "BOS", "NYK", "TOR", "ATL", "CHA", "MIA"],
  IND: ["TOR", "MIA", "ATL", "BOS", "BKN", "NYK", "PHI", "CHA", "ORL", "WAS"],
  MIL: ["BOS", "ORL", "CHA", "NYK", "BKN", "PHI", "TOR", "ATL", "MIA", "WAS"],
  ATL: ["IND", "TOR", "BOS", "DET", "BKN", "NYK", "PHI", "CHI", "CLE", "MIL"],
  CHA: ["MIL", "NYK", "CHI", "PHI", "BOS", "BKN", "TOR", "CLE", "DET", "IND"],
  MIA: ["BKN", "CHI", "IND", "NYK", "BOS", "PHI", "TOR", "CLE", "DET", "MIL"],
  ORL: ["BOS", "CLE", "BKN", "MIL", "NYK", "PHI", "TOR", "CHI", "DET", "IND"],
  WAS: ["DET", "PHI", "CLE", "TOR", "BOS", "BKN", "NYK", "CHI", "IND", "MIL"],
  DAL: ["GSW", "MIN", "OKC", "SAC", "DEN", "POR", "UTA", "LAC", "LAL", "PHX"],
  HOU: ["LAC", "POR", "LAL", "UTA", "DEN", "MIN", "OKC", "GSW", "PHX", "SAC"],
  MEM: ["LAL", "DEN", "POR", "PHX", "MIN", "OKC", "UTA", "GSW", "LAC", "SAC"],
  NOP: ["SAC", "UTA", "LAC", "MIN", "DEN", "OKC", "POR", "GSW", "LAL", "PHX"],
  SAS: ["OKC", "PHX", "GSW", "DEN", "MIN", "POR", "UTA", "LAC", "LAL", "SAC"],
  DEN: ["SAS", "LAL", "GSW", "MEM", "DAL", "HOU", "NOP", "LAL", "PHX", "SAC"],
  MIN: ["NOP", "PHX", "DAL", "LAC", "HOU", "MEM", "SAS", "GSW", "LAL", "SAC"],
  OKC: ["LAL", "SAC", "DAL", "SAS", "HOU", "MEM", "NOP", "GSW", "LAC", "PHX"],
  POR: ["MEM", "LAC", "HOU", "SAC", "DAL", "NOP", "SAS", "GSW", "LAL", "PHX"],
  UTA: ["GSW", "HOU", "NOP", "PHX", "DAL", "MEM", "SAS", "LAC", "LAL", "SAC"],
  GSW: ["DEN", "SAS", "DAL", "UTA", "HOU", "MEM", "NOP", "MIN", "OKC", "POR"],
  LAC: ["NOP", "MIN", "HOU", "POR", "DAL", "MEM", "SAS", "DEN", "OKC", "UTA"],
  LAL: ["HOU", "OKC", "DEN", "MEM", "DAL", "NOP", "SAS", "MIN", "POR", "UTA"],
  PHX: ["MEM", "UTA", "MIN", "SAS", "DAL", "HOU", "NOP", "DEN", "OKC", "POR"],
  SAC: ["POR", "DAL", "NOP", "OKC", "HOU", "MEM", "SAS", "DEN", "MIN", "UTA"],
};

export default commons;
