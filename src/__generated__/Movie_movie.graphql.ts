/**
 * @generated SignedSource<<8b9d769c443a8835264328f682e753f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs, Result } from "relay-runtime";
export type Movie_movie$data = Result<{
  readonly director: string;
  readonly genre: string;
  readonly id: string;
  readonly rating: number | null | undefined;
  readonly title: string;
  readonly year: number;
  readonly " $fragmentType": "Movie_movie";
}, unknown>;
export type Movie_movie$key = {
  readonly " $data"?: Movie_movie$data;
  readonly " $fragmentSpreads": FragmentRefs<"Movie_movie">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "catchTo": "RESULT"
  },
  "name": "Movie_movie",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "director",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "year",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "genre",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rating",
      "storageKey": null
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "9733cd9bb7bfc1e7d1fb4aa604f28fbc";

export default node;
