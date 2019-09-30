// @flow
import * as React from "react";
import { Button } from "primereact/button";
import ModalContainer from "../modals";
import { Column } from "primereact/column";
import { PiramisTreeTable } from "../";
import { PiramisContext } from "../../shared/piramis-context";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import generateTree from "../../shared/entities-tree";
import useEntitiesList from "../../shared/entities-hook";

type Props = {
  style?: any,
  tooltip: string,
  groups: "*" | Array<string>,
  disabled?: boolean,
  onSelect: (entity: IEntity) => void
};

export default function EntityTreeSelector(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [opened: boolean, openModal] = React.useState(false);
  const { labels, entityService, hub } = context;
  const loadingOptions = {
    type: "match",
    field: "category",
    value: ITEM_CATEGORY.dealer,
    includeHierarchy: true,
    filters:
      props.groups === "*"
        ? undefined
        : {
            group: { matchMode: "terms", value: props.groups }
          }
  };
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(loadingOptions, entityService, hub);

  const entities = result.items.concat(
    result.groups.filter(item => item.category !== ITEM_CATEGORY.utente)
  );
  function selectEntity({ value }) {
    const item: any = entities.find(el => el.uuid === value);
    props.onSelect(item);
    openModal(false);
  }

  async function openSelector() {
    // await onLoadResults(loadingOptions, 'refresh');
    openModal(true);
  }

  const tree = generateTree(entities);

  return (
    <React.Fragment>
      <ModalContainer
        onClose={() => openModal(false)}
        visible={opened}
        height="auto"
        header={labels.get(
          `Seleziona il dealer desiderato cliccando sulla riga`
        )}
        width="90%"
      >
        <PiramisTreeTable
          options={options.esoptions}
          table={{
            loading,
            selectionMode: "single",
            onSelectionChange: selectEntity,
            headerTitle: labels.get("elencoDealers"),
            rowClassName: rowData => {
              return {
                "dealer-row":
                  rowData.category === ITEM_CATEGORY.dealer &&
                  rowData.group === rowData.parentId,
                "filiale-row":
                  rowData.category === ITEM_CATEGORY.dealer &&
                  rowData.group !== rowData.parentId,
                "seller-row": rowData.category === ITEM_CATEGORY.utente
              };
            }
          }}
          onLoadResults={onLoadResults}
          result={result}
          tree={tree}
        >
          <Column
            expander
            field="category"
            header={labels.get("tipo")}
            body={data => (
              <span>
                <i
                  style={{ marginRight: "2px" }}
                  className={CATEGORY_ICON[data.category]}
                />
                {labels.get(data.category)}
              </span>
            )}
          />
          <Column
            field="name"
            header={labels.get("nome")}
            sortable
            filter={true}
            filterMatchMode="contains"
          />
          <Column
            field="taxCode"
            header={labels.get("codiceFiscale")}
            sortable
            filter={true}
            filterMatchMode="contains"
          />
          <Column
            field="vatCode"
            header={labels.get("partitaIva")}
            sortable
            filter={true}
            filterMatchMode="contains"
          />
          <Column
            field="address.formatted_address"
            header={labels.get("indirizzo")}
            body={data =>
              data.address ? data.address.formatted_address : labels.get("N/D")
            }
            sortable
            filter={true}
            filterMatchMode="contains"
          />
        </PiramisTreeTable>
      </ModalContainer>
      <Button
        style={props.style}
        disabled={props.disabled}
        tooltip={props.tooltip}
        className="p-button p-component p-button-secondary p-button-icon-only"
        icon="fas fa-hand-pointer"
        onClick={openSelector}
      />
    </React.Fragment>
  );
}
