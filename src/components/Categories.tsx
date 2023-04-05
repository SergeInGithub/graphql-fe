import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ModalDialog } from './ModalDialog';

const entityName = 'Category';

const [displayModal, setDisplayModal] = useState(false);
const [entity, setEntity] = useState<Entity | undefined>(undefined);

// Usage of the Apollo Client's useQuery & useMutation to interact with
// our GraphQl API

const { loading, error, data } = useQuery<AllEntity>(GET_ALL);
const [addEntity, { error: errorAdding }] = useMutation(ADD_ENTITY, {
  refetchQueries: [{ query: GET_ALL }],
});
const [deleteEntity, { error: errorDeleting }] = useMutation(DELETE_ENTITY, {
  refetchQueries: [{ query: GET_ALL }],
});
const [updateEntity, { error: errorUpdating }] = useMutation(UPDATE_ENTITY, {
  refetchQueries: [{ query: GET_ALL }],
});

if (loading) return <span>Loading...</span>;
if (error || errorAdding || errorDeleting || errorUpdating) {
  const message =
    error?.message ||
    errorAdding?.message ||
    errorDeleting?.message ||
    errorUpdating?.message;
  return <span>{`Error: ${message}`}</span>;
}
if (!data) return <span>No records found.</span>;

const handleSave = () => {
  setDisplayModal(false);
  // Verifies if it's an update operation or if it should create new entity
  // based on having an existing nodeId
  if (entity?.nodeId) {
    updateEntity({
      variables: {
        nodeId: entity.nodeId,
        description: entity.description,
      },
    });
  } else {
    addEntity({
      variables: {
        description: entity?.description,
      },
    });
  }
};

// Renders the existing entity data into a simple table
const renderData = () => {
  return data.allCategories.nodes.map((entity: Entity) => {
    const { nodeId, id, description } = entity;
    return (
      <tr key={id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{id}</div>
        </td>
        <td className="px-6 py whitespace-nowrap tex-sm text-gray-500">
          {description}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            className="text-inidigo-600 hover:text-indigo-900 pr-2"
            onClick={() => {
              setEntity(entity);
              setDisplayModal(true);
            }}
          >
            Edit
          </button>
          <button
            className="text-inidigo-600 hover:text-indigo-900"
            onClick={() => deleteEntity({ variables: { nodeId } })}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });
};

export const Categories = (props: {}) => {};
