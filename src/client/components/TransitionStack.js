import React from "react";

export default function TransitionStack({transition, children, delay}) {
  if (delay === undefined) delay = 0;
  return React.Children.map(children, function (child, index) {
    return React.cloneElement(
      transition,
      {
        style: {
          transitionDelay: transition.props.in ? delay * index + "ms" : "0ms",
        },
      },
      child,
    );
  });
}