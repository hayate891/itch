
import * as React from "react";
import {connect} from "./connect";

import {map, values} from "underscore";
import * as actions from "../actions";

import {ICollectionRecordSet} from "../types";
import {IAction, dispatcher} from "../constants/action-types";

export class CollectionGrid extends React.Component<ICollectionGridProps, void> {
  render () {
    const {collections} = this.props;
    const {navigate} = this.props;

    return <div>
      {map(values(collections), (collection) => {
        const {id, title} = collection;

        return <div key={id} className="collection-hub-item" onClick={() => navigate(`collections/${id}`)}>
          {title} ({(collection.gameIds || []).length})
        </div>;
      })}
    </div>;
  }
}

interface ICollectionGridProps {
  // specified
  collections: ICollectionRecordSet;

  // derived
  navigate: typeof actions.navigate;
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: (action: IAction<any>) => void) => ({
  navigate: dispatcher(dispatch, actions.navigate),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionGrid);
