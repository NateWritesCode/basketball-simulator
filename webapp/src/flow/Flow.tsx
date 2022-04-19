import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { Box, Button, Heading } from "@chakra-ui/react";

fcl.config({
  "accessNode.api": "http://localhost:8080",
  "app.detail.icon":
    "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
  "app.detail.title": "Basketball Simulator",
  "discovery.wallet": "http://localhost:8701/fcl/authn", //dev wallet
  "0xStuff": "0xf8d6e0586b0a20c7",
});

const Flow = () => {
  const [name, setName] = useState();
  const [user, setUser] = useState({ addr: "" });

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  if (user.addr) {
    return (
      <Box>
        {user.addr ? user.addr : ""}
        <Button
          onClick={() => {
            fcl.unauthenticate();
          }}
        >
          Log out
        </Button>
        <Box>
          <Button
            onClick={async () => {
              const response = await fcl
                .send([
                  fcl.script`
              import Stuff from 0xStuff

              pub fun main(): String {
                return Stuff.name
              }
              `,
                ])
                .then(fcl.decode);

              console.log("response", response);

              setName(response);
            }}
          >
            Get name
          </Button>
          <Heading as="h3">{name}</Heading>
        </Box>
        <Box>
          <Button
            onClick={async () => {
              const randomString = (Math.random() + 1)
                .toString(36)
                .substring(7);
              const txId = await fcl
                .send([
                  fcl.transaction`
                    import Stuff from 0xStuff

                    transaction(newName: String) {
                      prepare(signer: AuthAccount) {
                        log("Hello world")
                        log(signer.address)
                      }
                      
                      execute {
                        Stuff.changeName(newName: newName)
                      }
                    }
              `,
                  fcl.args([fcl.arg(randomString, t.String)]),
                  fcl.proposer(fcl.authz), //person initiating the transaction
                  fcl.payer(fcl.authz), //person paying for it
                  fcl.authorizations([fcl.authz]), //array of people authorizing it, multiple signers
                  fcl.limit(9999),
                ])
                .then(fcl.decode);

              console.log("{txId}", { txId });
            }}
          >
            Change name
          </Button>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box>
        <Button
          onClick={() => {
            fcl.authenticate();
          }}
        >
          Log in
        </Button>
      </Box>
    );
  }
};

export default Flow;
