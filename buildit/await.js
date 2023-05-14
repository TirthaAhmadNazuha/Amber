const Await = (props, childs) => {
  props.resolve.onPending = props.onPending;
  props.resolve.onReject = props.onReject;
  props.resolve.childs = childs;
  return props.resolve;
};
export default Await;
