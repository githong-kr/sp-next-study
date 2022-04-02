export interface clsRequestParams {
  prefix?: string;
  classNames?: string;
}

export function cls(...clsRequestObjectList: clsRequestParams[]) {
  const resultClassName = new Array<string>();

  clsRequestObjectList.map((clsRequestObject) => {
    if (!clsRequestObject.prefix) {
      resultClassName.push(
        clsRequestObject.classNames ? clsRequestObject.classNames : ''
      );
    } else {
      clsRequestObject.classNames?.split(' ').map((className) => {
        resultClassName.push(`${clsRequestObject.prefix}:${className}`);
      });
    }
  });

  return resultClassName.join(' ');
}
