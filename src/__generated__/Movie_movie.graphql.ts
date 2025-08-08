/**
 * @generated SignedSource<<e50b59780fa09ffdce31d2faddf0f45d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Movie_movie$data = {
  readonly director: string | null | undefined;
  readonly genre: string | null | undefined;
  readonly id: string | null | undefined;
  readonly rating: number | null | undefined;
  readonly title: string | null | undefined;
  readonly year: number | null | undefined;
  readonly " $fragmentType": "Movie_movie";
};
export type Movie_movie$key = {
  readonly " $data"?: Movie_movie$data;
  readonly " $fragmentSpreads": FragmentRefs<"Movie_movie">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
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

(node as any).hash = "780a552e8ba148ed16281fb664fc1921";

export default node;
