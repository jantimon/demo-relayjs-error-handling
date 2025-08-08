/**
 * @generated SignedSource<<2e1c793e9b08b5132f18ba28e2dcce8b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AppQuery$variables = Record<PropertyKey, never>;
export type AppQuery$data = {
  readonly movies: ReadonlyArray<{
    readonly id: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"Movies_movies">;
  }> | null | undefined;
};
export type AppQuery = {
  response: AppQuery$data;
  variables: AppQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Movie",
        "kind": "LinkedField",
        "name": "movies",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Movies_movies"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Movie",
        "kind": "LinkedField",
        "name": "movies",
        "plural": true,
        "selections": [
          (v0/*: any*/),
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b3d11087e642adfb658da9fe163034a3",
    "id": null,
    "metadata": {},
    "name": "AppQuery",
    "operationKind": "query",
    "text": "query AppQuery {\n  movies {\n    id\n    ...Movies_movies\n  }\n}\n\nfragment Movie_movie on Movie {\n  id\n  title\n  director\n  year\n  genre\n  rating\n}\n\nfragment Movies_movies on Movie {\n  id\n  ...Movie_movie\n}\n"
  }
};
})();

(node as any).hash = "8f79ab7cb14370aa9ea8bda3f03df984";

export default node;
