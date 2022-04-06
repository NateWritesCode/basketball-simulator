# Basketball Simulator

A work-in-progress Basketball Game Simulator written in Typescript. Utilizes the excellent Python library [pbpstats](https://github.com/dblackrun/pbpstats) to parse NBA play-by-play data to generate more realistic simulations.

Heart of the simulator lives in `server/src/entities/GameSim.ts`. The simulator utilizes the Observer pattern.

Play-by-play parser is located at `python/pbp-parser.py`.

TODOs galore, but we're just getting started. Bless this mess!!
