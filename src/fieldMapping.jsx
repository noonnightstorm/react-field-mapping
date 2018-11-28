import './fieldMapping.less';
import {Component} from 'react';
import SourceData from './sourceData.jsx';
import TargetData from './targetData.jsx';
import DrawLines from './drawLines.jsx';
import PropTypes from 'prop-types';
import { calCoord } from './util.js';
import _ from 'lodash';

class FieldMapping extends Component {
  constructor(props) {
    super(props);
    const sourceData = _.uniqWith(props.sourceData, (n1, n2) => {
      return n1.name === n2.name;
    });
    const targetData = _.uniqWith(props.targetData, (n1, n2) => {
      return n1.name === n2.name;
    });
    this.state = {
      relation: [],
      sourceData,
      targetData,
      currentRelation: {}
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const relation = calCoord(_.assign([], this.props.relation), this);
      this.setState({
        relation
      });
    }, 100);
  }
  changeRelation(relation) {
    this.setState({
      relation
    }, () => {
      this.props.onChange && this.props.onChange(relation);
    });
  }
  changeIconStatus(iconStatus) {
    this.setState({
      iconStatus
    });
  }
  overActive(item, type, active) {
    const relation = _.assign([], this.state.relation);
    let currentRelation = {};
    relation.map(n => {
      if(n[type].name === item.name) {
        if(active === "enter") {
          currentRelation = n;
          return;
        }else if (active === "leave") {
          currentRelation = {};
        }
      }
    });
    this.setState({
      currentRelation
    });
  }
  render() {
    const { relation, iconStatus, sourceData, targetData, currentRelation } = this.state;
    const {
      className = "",
      style = {},
      onDrawStart,
      onDrawing,
      onDrawEnd
    } = this.props;

    const sourceOpt = {
      ref: (me) => {this.sourceCom = me;},
      iconStatus,
      relation,
      data: sourceData,
      currentRelation,
      overActive: this.overActive.bind(this)
    };
    const targetOpt = {
      ref: (me) => {this.targetCom = me;},
      iconStatus,
      relation,
      data: targetData,
      currentRelation,
      overActive: this.overActive.bind(this)
    };
    const drawLinesOpt = {
      sourceData,
      targetData,
      onDrawStart,
      onDrawing,
      onDrawEnd,
      relation,
      currentRelation,
      onChange: this.changeRelation.bind(this),
      changeIconStatus: this.changeIconStatus.bind(this)
    };
    return <div style={style} className={`react-field-mapping-box ${className}`}>
      <SourceData {...sourceOpt} />
      <TargetData {...targetOpt} />
      <DrawLines {...drawLinesOpt} />
    </div>;
  }
}

FieldMapping.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  sourceData: PropTypes.array,// [{name,type}], "param name is required"
  targetData: PropTypes.array,// [{name,type}], "param name is required"
  relation: PropTypes.array,// [{source:{name, type}, target:{name, type}}], "param {source:{name},target:{name}} is required"
  onChange: PropTypes.func, // function(param= relation)
  onDrawStart: PropTypes.func,// function(params=source, relation)
  onDrawing: PropTypes.func,// function(params=source, relation)
  onDrawEnd: PropTypes.func// function(params=source, relation)
};
export default FieldMapping;