// @flow
import * as React from 'react';
import { Card } from 'primereact/card';
import { OrganizationChart } from 'primereact/organizationchart';
import { HistoryTitle } from '../../_components';
import { PiramisContext } from '../../shared/piramis-context';
import generateTree from '../../shared/entities-tree';
import { PIRAMIS_ROLES } from '../../shared/const';
import getNode from './nodes';

type Props = {
  groupId: string,
  isAdmin: boolean,
  entityId?: string
};

export default function HierarchyView(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [result: { tree: Array<any>, list: Array<any> }, setResult] = React.useState({
    tree: [],
    list: []
  });
  const [loading: boolean, setLoading] = React.useState(false);
  const [operations: number, setOperations] = React.useState(0);

  const { labels, entityService, hub } = context;
  const { groupId, isAdmin } = props;

  async function loadData() {
    setLoading(true);
    hub.loading(true);
    try {
      const result = await entityService.getGroup(groupId);
      const tree = generateTree(result);
      setResult({ tree, list: result });
    } finally {
      setLoading(false);
      hub.loading(false);
    }
  }

  async function onPutEntity(entity: IEntity) {
    if (entity.roles === PIRAMIS_ROLES.venditore) {
      await context.usersService.create(entity);
    } else {
      await context.entityService.put([entity]);
    }
    setOperations(operations + 1);
  }

  async function onEditEntity(entity: IEntity) {
    if (entity.roles === PIRAMIS_ROLES.venditore) {
      await context.usersService.action(entity, 'edituser');
    } else {
      await context.entityService.put([entity]);
    }
    setOperations(operations + 1);
  }

  async function onDeleteEntity(entity: IEntity) {
    console.log(entity);
  }

  React.useEffect(() => {
    loadData();
  }, [operations]);

  function nodeTemplate(node) {
    const Node = getNode(node.data.roles || node.data.category) || fallback;
    const canViewDetails =
      isAdmin || node.hierarchyId.includes(props.entityId) || node.uuid === props.entityId;
    const parent = result.list.find(el => el.uuid === node.parentId);
    return (
      <Node
        node={node.data}
        labels={context.labels}
        canEdit={isAdmin}
        parent={parent}
        root={context.root}
        canViewDetails={canViewDetails}
        hasChildren={node.children && node.children.length}
        onAdd={isAdmin && onPutEntity}
        onEdit={isAdmin && onEditEntity}
        onDelete={isAdmin && onDeleteEntity}
      />
    );
  }

  function fallback(props: any) {
    return (
      <div className={`font-sans rounded border px-2 py-1 max-w-md bg-grey-darkest text-left`}>
        <div className="mb-2 font-bold ">{props.node.category}</div>
        <div className="mb-2 font-bold ">{props.node.name}</div>
      </div>
    );
  }

  if (loading && (!result.tree || !result.tree.length))
    return (
      <div className="text-center">
        <i className="fas fa-circle-notch fa-spin text-grey-light" style={{ fontSize: '20em' }} />
      </div>
    );
  if (!result.tree || !result.tree.length) return null;
  return (
    <Card title={HistoryTitle(labels.get('Struttura del gruppo'))}>
      <OrganizationChart value={result.tree} nodeTemplate={nodeTemplate} />
    </Card>
  );
}
