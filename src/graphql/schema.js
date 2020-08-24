import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from "graphql";

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  }
});

const peopleData = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sara Smith" },
  { id: 3, name: "Budd Deey" }
];

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    people: {
      args: {
        textSearch: { type: GraphQLString }
      },
      type: new GraphQLList(PersonType),
      resolve: (parent, args, context) => {
        console.log('Resolving query', JSON.stringify({ args }, null, 2))
        if (args.textSearch) {
          return peopleData.filter((person) =>
            person.name.toUpperCase().includes(args.textSearch.toUpperCase())
          );
        }
        return peopleData;
      }
    },
    stuff: {
      type: new GraphQLObjectType({
        name: 'Stuff',
        fields: {
          something: { type: GraphQLString }
        }
      }),
      resolve: () => ({ something: 'blah' })
    }
  }
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString }
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name
        };

        peopleData.push(person);
        return person;
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
