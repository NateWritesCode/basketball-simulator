import fs from "fs";
import fsExtra from "fs-extra";
import csvdb from "csv-database";

class CsvDb {
  model: any;

  constructor() {
    const playerGameStatColumns = {
      andOne: { dataType: "int" },
      ast: { dataType: "int" },
      blk: { dataType: "int" },
      blkd: { dataType: "int" },
      drb: { dataType: "int" },
      dunks: { dataType: "int" },
      fga: { dataType: "int" },
      fgm: { dataType: "int" },
      flagrant1: { dataType: "int" },
      flagrant2: { dataType: "int" },
      fouls: { dataType: "int" },
      foulsOffensive: { dataType: "int" },
      foulsOffensiveCharge: { dataType: "int" },
      foulsOffensiveOther: { dataType: "int" },
      foulsShooting: { dataType: "int" },
      foulsTechnical: { dataType: "int" },
      fouled: { dataType: "int" },
      fta: { dataType: "int" },
      ftm: { dataType: "int" },
      gameGroupId: { dataType: "id" },
      heaves: { dataType: "int" },
      isEjected: { dataType: "boolean" },
      isInjuredWithNoReturn: { dataType: "boolean" },
      isStarter: { dataType: "boolean" },
      jumpBallsLost: { dataType: "int" },
      jumpBallsWon: { dataType: "int" },
      orb: { dataType: "int" },
      plusMinus: { dataType: "int" },
      pts: { dataType: "int" },
      ptsba: { dataType: "int" },
      stl: { dataType: "int" },
      substitutionIn: { dataType: "int" },
      substitutionOut: { dataType: "int" },
      timePlayed: { dataType: "int" },
      tov: { dataType: "int" },
      tpa: { dataType: "int" },
      tpm: { dataType: "int" },
    };

    const teamGameStatColumns = {
      andOne: { dataType: "int" },
      ast: { dataType: "int" },
      blk: { dataType: "int" },
      blkd: { dataType: "int" },
      drb: { dataType: "int" },
      dunks: { dataType: "int" },
      ejections: { dataType: "int" },
      fga: { dataType: "int" },
      fgm: { dataType: "int" },
      fouls: { dataType: "int" },
      foulsOffensive: { dataType: "int" },
      foulsOffensiveCharge: { dataType: "int" },
      foulsOffensiveOther: { dataType: "int" },
      foulsShooting: { dataType: "int" },
      foulsTechnical: { dataType: "int" },
      fta: { dataType: "int" },
      ftm: { dataType: "int" },
      gameGroupId: { dataType: "int" },
      heaves: { dataType: "int" },
      jumpBallsLost: { dataType: "int" },
      jumpBallsWon: { dataType: "int" },
      orb: { dataType: "int" },
      pf: { dataType: "int" },
      pts: { dataType: "int" },
      stl: { dataType: "int" },
      substitutions: { dataType: "int" },
      teamDrb: { dataType: "int" },
      teamOrb: { dataType: "int" },
      tov: { dataType: "int" },
      tpa: { dataType: "int" },
      tpm: { dataType: "int" },
    };

    this.model = {
      conference: {
        columns: {
          abbrev: { dataType: "string" },
          divisions: {
            dataType: "relationOneToMany",
            relationModelType: "division",
            optional: true,
            relationKey: "conferenceId",
          },
          leagueId: {
            dataType: "relationManyToOne",
            relationModelType: "league",
            relationKey: "id",
          },
          id: { dataType: "id" },
          name: { dataType: "string" },
        },
        delimiter: "|",
        filePath: "./src/data/conference",
        fileType: "txt",
      },
      division: {
        columns: {
          abbrev: { dataType: "string" },
          conferenceId: {
            dataType: "relationManyToOne",
            relationModelType: "conference",
            optional: true,
            relationKey: "id",
          },
          id: { dataType: "id" },
          leagueId: {
            dataType: "relationManyToOne",
            relationModelType: "league",
            relationKey: "id",
          },
          name: { dataType: "string" },
        },
        delimiter: "|",
        filePath: "./src/data/division",
        fileType: "txt",
      },
      league: {
        columns: {
          abbrev: { dataType: "string" },
          conferences: {
            dataType: "relationOneToMany",
            relationModelType: "conference",
            optional: true,
            relationKey: "leagueId",
          },
          divisions: {
            dataType: "relationOneToMany",
            relationModelType: "division",
            optional: true,
            relationKey: "leagueId",
          },
          id: { dataType: "id" },
          name: { dataType: "string" },
        },
        delimiter: "|",
        filePath: "./src/data/league",
        fileType: "txt",
      },
      "player-game": {
        columns: { ...playerGameStatColumns, gameId: { dataType: "id" } },
        delimiter: "|",
        filePath: "./src/data/player-game",
        fileType: "txt",
      },
      "player-game-group": {
        columns: { ...playerGameStatColumns, gp: { dataType: "int" } },
        delimiter: "|",
        filePath: "./src/data/player-game-group",
        fileType: "txt",
      },
      player: {
        columns: {
          active: { dataType: "boolean" },
          birthdate: { dataType: "dateTime" },
          country: { dataType: "string" },
          draftNumber: { dataType: "int" },
          draftRound: { dataType: "int" },
          draftYear: { dataType: "dateTime" },
          familyName: { dataType: "string" },
          fromYear: { dataType: "dateTime" },
          givenName: { dataType: "string" },
          greatest75: { dataType: "boolean" },
          hasPlayedDLeague: { dataType: "boolean" },
          hasPlayedGames: { dataType: "boolean" },
          hasPlayedNba: { dataType: "boolean" },
          height: { dataType: "int" },
          id: { dataType: "int" },
          jerseyNumber: { dataType: "int" },
          playerCode: { dataType: "string" },
          position: { dataType: "string" },
          school: { dataType: "string" },
          seasonsExperience: { dataType: "int" },
          slug: { dataType: "string" },
          teamId: { dataType: "int" },
          toYear: { dataType: "dateTime" },
          weight: { dataType: "int" },
        },
        delimiter: "|",
        filePath: "./src/data/team",
        fileType: "txt",
      },
      standings: {
        columns: {
          teamId: { dataType: "id" },
          w: { dataType: "int" },
          l: { dataType: "int" },
        },
        delimiter: "|",
        filePath: "./src/data/standings",
        fileType: "txt",
      },
      "team-game": {
        columns: { ...teamGameStatColumns, gameId: { dataType: "id" } },
        delimiter: "|",
        filePath: "./src/data/team-game",
        fileType: "txt",
      },
      "team-game-group": {
        columns: { ...teamGameStatColumns, gp: { dataType: "int" } },
        delimiter: "|",
        filePath: "./src/data/team-game-group",
        fileType: "txt",
      },
      team: {
        columns: {
          abbrev: { dataType: "string" },
          homeName: { dataType: "string" },
          id: { dataType: "id" },
          nickname: { dataType: "string" },
          venue: { dataType: "string" },
          venueCapacity: { dataType: "int" },
          yearFounded: { dataType: "dateTime" },
          facebook: { dataType: "string" },
          instagram: { dataType: "string" },
          twitter: { dataType: "string" },
          lat: { dataType: "int" },
          lng: { dataType: "int" },
        },
        delimiter: "|",
        filePath: "./src/data/team",
        fileType: "txt",
      },
    };
  }

  add = async (
    filename: string,
    modelType: string,
    data: Object | Object[]
  ) => {
    try {
      const db = await this.getDb(filename, modelType);
      await db.add(data);
      console.log(`Finished adding ${filename} ${modelType}`);
    } catch (error) {
      throw new Error(error);
    }
  };

  private addRow = async (
    db: Awaited<ReturnType<CsvDb["getDb"]>>,
    data: Object | Object[]
  ) => {
    try {
      await db.add(data);
    } catch (error) {
      throw new Error(error);
    }
  };

  convertData = async (modelType: string, data: any) => {
    const dataKeys = Object.keys(data);

    for (let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i];
      if (this.model[modelType]) {
        if (this.model[modelType].columns) {
          if (this.model[modelType].columns[key]) {
            if (this.model[modelType].columns[key].dataType) {
              const { dataType, relationKey, relationModelType } =
                this.model[modelType].columns[key];

              switch (dataType) {
                case "boolean":
                  data[key] = Boolean(data[key]);
                  break;

                case "date":
                  break;

                case "id":
                  break;

                case "int":
                  data[key] = Number(data[key]);

                  break;

                case "relationManyToOne":
                  if (!relationKey || !relationModelType) {
                    throw new Error(
                      `Missing required relation data ${relationKey} ${relationModelType}`
                    );
                  }

                  break;

                case "relationOneToMany":
                  if (!relationKey || !relationModelType) {
                    throw new Error(
                      `Missing required relation data ${relationKey} ${relationModelType}`
                    );
                  }

                  if (this.model[relationModelType]) {
                    const relationDb = await this.getDb(
                      relationModelType,
                      relationModelType
                    );

                    const relationData = await this.getAllData(
                      relationDb,
                      relationModelType
                    );

                    data[key] = relationData;
                  }

                  break;

                case "string":
                  break;

                default:
                  break;
              }
            }
          }
        }
      }
    }

    return data;
  };

  deleteFile = (filePath: string | string[]) => {
    if (typeof filePath === "string") {
      fs.unlinkSync(filePath);
    } else {
      filePath.forEach((str) => {
        fs.unlinkSync(str);
      });
    }
  };

  deleteFilesInFolder = (directory: string) => {
    fsExtra.emptyDirSync(directory);
  };

  edit = async (
    filename: string,
    modelType: string,
    filter: Object,
    data: Object
  ) => {
    const db = await this.getDb(filename, modelType);
    this.stringifyObjValues(filter);
    await db.edit(filter, data);
  };

  editRow = async (
    db: Awaited<ReturnType<CsvDb["getDb"]>>,
    filter: any,
    data: any
  ) => {
    this.stringifyObjValues(filter);
    await db.edit(filter, data);
  };

  getAllData = async (
    db: Awaited<ReturnType<CsvDb["getDb"]>>,
    modelType: string
  ) => {
    const data = await db.get();

    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      data[i] = await this.convertData(modelType, obj);
    }

    return data;
  };

  getAllDataTest = async (filename: string, modelType: string) => {
    const db = await this.getDb(filename, modelType);

    return await this.getAllData(db, modelType);
  };

  getColumns = (modelType: string) => {
    const columnKeys = Object.keys(this.model[modelType].columns);

    return columnKeys.map((columnKey) => {
      return { field: columnKey, ...this.model[modelType].columns[columnKey] };
    });
  };

  getColumnNames = (modelType: string) => {
    return Object.keys(this.model[modelType].columns);
  };

  getDb = async (filename: string, modelType: string) => {
    return await csvdb(
      this.getFilePath(modelType, filename),
      this.getColumnNames(modelType),
      this.model[modelType].delimiter
    );
  };

  getFilePath = (modelType: string, filename: string) => {
    return `${this.model[modelType].filePath}/${filename}.${this.model[modelType].fileType}`;
  };

  getRowData = async (
    db: Awaited<ReturnType<CsvDb["getDb"]>>,
    filter: any,
    modelType: string
  ): Promise<any> => {
    const filterKeys = Object.keys(filter);
    filterKeys.forEach((key) => {
      filter[key] = `${filter[key]}`;
    });
    const rowResult = await db.get(filter);
    if (rowResult.length > 1) {
      throw new Error("getRowData received wrong value");
    }

    if (rowResult.length === 0) {
      return [];
    }

    let rowData: any = (await db.get(filter))[0];

    rowData = await this.convertData(modelType, rowData);

    return rowData;
  };

  incrementOneRow = async (
    filename: string,
    modelType: string,
    filter: Object,
    data: any
  ) => {
    const db = await this.getDb(filename, modelType);
    let rowData = await this.getRowData(db, filter, modelType);

    if (rowData.length === 0) {
      await this.initializeRow(db, modelType, filter);
      rowData = await this.getRowData(db, filter, modelType);
    }

    const dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      rowData[key] = rowData[key] + data[key];
    });

    await this.editRow(db, filter, rowData);
  };

  initializeRow = async (
    db: Awaited<ReturnType<CsvDb["getDb"]>>,
    modelType: string,
    initialValues: any
  ) => {
    const data: any = {};
    const columns = this.getColumns(modelType);

    columns.forEach((column) => {
      const { field, dataType } = column;

      if (field in initialValues) {
        data[field] = initialValues[field];
        return;
      }

      if (dataType === "int") {
        data[field] = 0;
        return;
      }

      data[field] = "";
    });

    await this.addRow(db, data);
  };

  stringifyObjValues = (obj: any) => {
    const objKeys = Object.keys(obj);
    objKeys.forEach((key) => {
      obj[key] = `${obj[key]}`;
    });
  };
}

const csvDbClient = new CsvDb();

export { csvDbClient };
