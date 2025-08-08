/**
 * @generated SignedSource<<a746db0edcfb3b861ad7be5b74a0bdce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Movies_movies$data = ReadonlyArray<{
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"Movie_movie">;
  readonly " $fragmentType": "Movies_movies";
}>;
export type Movies_movies$key = ReadonlyArray<{
  readonly " $data"?: Movies_movies$data;
  readonly " $fragmentSpreads": FragmentRefs<"Movies_movies">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "Movies_movies",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Movie_movie"
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "e751a999cb5683b1c3cab89e57f4241a";

export default node;
