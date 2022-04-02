import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: string, option?: any) => {
  return cookies.set(name, value, { ...option });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

interface clsRequestParams {
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
