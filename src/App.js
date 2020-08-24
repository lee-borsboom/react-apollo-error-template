import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const PEOPLE_AND_STUFF = gql`
  query AllPeople($textSearch: String) {
    stuff {
      something
    }
    people(textSearch: $textSearch) {
      id
      name
    }
  }
`;

const ADD_PERSON = gql`
  mutation AddPerson($name: String) {
    addPerson(name: $name) {
      id
      name
    }
  }
`;

export default function App() {
  const [textSearch, setTextSearch] = useState("");
  const [name, setName] = useState("");
  const { loading, data, networkStatus } = useQuery(PEOPLE_AND_STUFF, {
    notifyOnNetworkStatusChange: true,
    variables: textSearch === "" ? {} : { textSearch }
  });

  console.log(JSON.stringify({ loading, networkStatus, data }, null, 2))

  const [addPerson] = useMutation(ADD_PERSON, {
    update: (cache, { data: { addPerson: addPersonData } }) => {
      const peopleResult = cache.readQuery({ query: PEOPLE_AND_STUFF });

      cache.writeQuery({
        query: PEOPLE_AND_STUFF,
        data: {
          ...peopleResult,
          people: [...peopleResult.people, addPersonData]
        }
      });
    }
  });

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <div className="add-person">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
        <button
          onClick={() => {
            addPerson({ variables: { name } });
            setName("");
          }}
        >
          Add person
        </button>
      </div>
      <h2>Names</h2>
      <input
        type="text"
        value={textSearch}
        placeholder="search text"
        onChange={(event) => setTextSearch(event.target.value)}
      />
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data?.people.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
