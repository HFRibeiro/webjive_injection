import React, { Component, Fragment, CSSProperties } from "react";
import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  BooleanInputDefinition,
  NumberInputDefinition,
  AttributeInputDefinition,
  SelectInputDefinition
} from "../types";

type Inputs = {
  showDevice: BooleanInputDefinition;
  showValue: BooleanInputDefinition;
  compare: NumberInputDefinition;
  relation: SelectInputDefinition;
  attribute: AttributeInputDefinition;
  classColor: SelectInputDefinition<"red-led" | "orange-led">;
}

type Props = WidgetProps<Inputs>;

function Led(props) {
  let classColor = "green-led";
  if (props.condition) {
    classColor = props.color;
  }
  classColor = classColor + " led";
  if (props.value === undefined) {
    classColor = classColor + " led-blank";
  }
  
  const pxSize = props.actualWidth/10+"px";
  const marginLED = props.actualWidth/20+"px";
  const marginLEDTOP = props.actualWidth/40+"px";
  
  const styleLED: CSSProperties = {height: pxSize, width: pxSize, borderRadius: pxSize, marginTop: marginLEDTOP};

  return <span style={styleLED} className={classColor}>{props.value}</span>;
}


class LedReadOnly extends Component<Props> {
  public render() {
    const { name } = this.deviceAndAttribute();

    const {actualWidth} = this.props;
    const fontSizeC = actualWidth/25;
    const marginLabel = actualWidth/10;

    const value = this.checkCondition();
    const style: CSSProperties = {height: "30px",padding: "0.1em", whiteSpace: "nowrap", fontSize: fontSizeC};

    const styleLable: CSSProperties = {marginLeft: marginLabel, fontSize: (fontSizeC*2)};

    let inner;

    if(this.props.inputs.showDevice && this.props.inputs.showValue)
    {
      inner = (
        <Fragment>
        <Led
          condition={value}
          color={this.props.inputs.classColor}
          value={this.props.inputs.attribute.value}
          actualWidth={this.props.actualWidth}
        />
        <a style={styleLable}>:{" "}{name}</a>
      </Fragment>
      );
    }
    else if(!this.props.inputs.showDevice && this.props.inputs.showValue)
    {
      inner = (
        <Fragment>
        <Led
          condition={value}
          color={this.props.inputs.classColor}
          value={this.props.inputs.attribute.value}
          actualWidth={this.props.actualWidth}
        />
      </Fragment>
      );
    }
    else
    {
      inner = (
        <Fragment>
        <Led condition={value} color={this.props.inputs.classColor} />
      </Fragment>
      );
    }

    return <div style={style}>{inner} </div>;
  }

  private checkCondition(): any {
    if (this.props.mode !== "run") {
      return (
        <span style={{ fontStyle: "italic" }}>
          <div className="green-led">value</div>
        </span>
      );
    }

    const {
      attribute: { value },
      compare,
      relation
    } = this.props.inputs;

    if (Number(parseFloat(value)) === value) {
      switch (relation) {
        case ">":
          return value > compare;
        case "<":
          return value < compare;
        case "=":
          return value === compare;
        case ">=":
          return value >= compare;
        case "<=":
          return value <= compare;
        default:
          break;
      }
    } else {
      return value === undefined ? null : String(value);
    }
  }

  private deviceAndAttribute(): { device: string; name: string } {
    const { attribute } = this.props.inputs;
    const device = attribute.device || "device";
    const name = attribute.attribute || "attribute";
    return { device, name };
  }
}

export const definition: WidgetDefinition<Inputs> = {
  type: "LED_DISPLAY",
  name: "Led Display",
  defaultWidth: 6,
  defaultHeight: 2,
  inputs: {
    attribute: {
      /* tslint:disable-next-line */
      type: "attribute",
      label: "",
      dataFormat: "scalar",
      required: true
    },
    relation: {
      type: "select",
      label: "relation",
      default: ">",
      options: [
        {
          name: "is more than",
          value: ">"
        },
        {
          name: "is less than",
          value: "<"
        },
        {
          name: "is equal to",
          value: "="
        },
        {
          name: "is more than or equal to",
          value: ">="
        },
        {
          name: "is less than or equal to",
          value: "<="
        }
      ]
    },
    compare: {
      type: "number",
      label: "Compare",
      default: 0
    },
    classColor: {
      type: "select",
      label: "style",
      default: "red-led",
      options: [
        {
          name: "Red",
          value: "red-led"
        },
        {
          name: "Orange",
          value: "orange-led"
        }
      ]
    },
    showDevice: {
      type: "boolean",
      label: "Attribute Value",
      default: false
    },
    showValue: {
      type: "boolean",
      label: "Display Value",
      default: false
    }
  }
};

export default { component: LedReadOnly, definition };