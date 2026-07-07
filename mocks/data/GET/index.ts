"use strict;";
/**
 * GET /
 * This file isn‘t mandatory. If it is not needed (such as when there is no need to modify response data), it can be deleted directly
 */

/**
 * Mock data resolve function, the original data source is the JSON file with the same name as this file
 * @param {object} originData (mocks/data/GET/index.json)
 * @param {MhkCvtrExtra} extra { url,method,path,params,query,body }
 * @returns {object} newData
 */
export default async function convertData(
  originData: Record<string, unknown>,
  _extra: Record<string, unknown>,
) {
  // write your logic here
  void _extra;
  return originData;
}
