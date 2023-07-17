type Relation = {
  id: string;
  name: string;
  children: Relation[],
  ExAtt: {
      startDate: string;
      endDate: string
  }
}

var RF = new Map<string, Map<number, Set<string>>>()
var temp = new Map<number, Set<string>>(), currentEG = '';
var datesMap = new Map<string, Map<string, any>>();
export function ccpdt_validation(tree: Relation): string[] {
  let log: string[] = [];
  traverse(tree.children, log, 1, []);
  findUnexpectedNodes(log);
  findTimeOverlap(log);
  if (!log.length) log.push('CCPDT Validation Passed Successfully.');
  return log;
}
function traverse(children: Relation[], log: string[], level: number, path:string[], prev?: Relation) {
  if (!children) return
  if(level>5){
      log.push("This is not a valid graph for CCPDT.")
      return
  }
  children.forEach(node => {
      path.push(node.name)
      calNodeByLevel(node, level);
     
      if (hasStartDate(node)) {
          if (getStartDate(node) >= getEndDate(node)) {
              log.push(`'${node.name}' start date should be lower than it's end date. ${path.join(' -> ')}`)
          }
          if (prev) {
              if (hasStartDate(node) && (getEndDate(prev) >= getStartDate(node))) {
                  log.push(`'${prev.name}' end date should be lower than the start date of '${node.name}': ${path.join(' -> ')}`)
              }
          }
      } else {
          log.push(`${node.name} has no start date: ${path.join(' -> ')}`);
      }
      traverse(node.children, log, level + 1, path, node);
      path.pop();
  })
}
function calNodeByLevel(node: Relation, level: number) {
  if (level === 1) {
      if (!RF.has(node.name)) {
          currentEG = node.name;
          temp = new Map<number, Set<string>>();
          RF.set(node.name, temp)
      }
      if (!datesMap.has(currentEG)) {
          datesMap.set(currentEG, new Map<string, any>())
      }
  } else if (level === 3) {
      setLevel(node, temp, level)
      setLevel2(node, temp, level + 1)
  }
  else if (level === 4) {
      setLevel2(node, temp, level + 1)
  }
  else {
      setLevel(node, temp, level)
      if (level === 2) {
          if (node.ExAtt) {
              datesMap.get(currentEG)?.set(node.name, [getStartDate(node), getEndDate(node)]);
          }
      }
  }
}
function setLevel2(node: Relation, temp: Map<number, Set<string>>, level: number) {
  if (!node.children) {
      node.children = [];
  }
  if (temp.has(level)) {
      temp.get(level)?.add(node.children.map(el => el.name).join(','))
  } else {
      temp.set(level, new Set([node.children.map(el => el.name).join(',')]))
  }
}
function setLevel(node: Relation, temp: Map<number, Set<string>>, level: number) {
  if (temp.has(level)) {
      temp.get(level)?.add(node.name)
  } else {
      temp.set(level, new Set([node.name]))
  }
}
function hasStartDate(node: Relation) {
  return node.ExAtt && node.ExAtt.startDate
}
function hasEndDate(node: Relation) {
  return node.ExAtt && node.ExAtt.endDate
}
function getStartDate(node: Relation) {
  return new Date(node.ExAtt.startDate).getTime()
}
function getEndDate(node: Relation) {
  if (hasEndDate(node)) return new Date(node.ExAtt.endDate).getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  if (node.children && node.children.length && hasStartDate(node.children[0])) return getStartDate(node.children[0]) - oneDay
  return getStartDate(node) + oneDay
}

function findUnexpectedNodes(log: string[]) {
  console.log(RF)
  console.log(datesMap)
  for (let [key, value] of RF.entries()) {
      let pg = [""]
      if (value.has(3)) {
          pg = Array.from(value.get(3)!)
          if (pg.length > 1) {
              log.push(`Entity group '${key}' does not have more then on product groups (${pg.join(',')}).`);
          } else {
              if (value.has(4)) {
                  const products = Array.from(value.get(4)!)
                  if (products.length > 1) {
                      log.push(`Inside Entity group '${key}', Product group '${pg[0]}' should have unique numbers of products throughout all customers: (${products.join(' | ')})`);
                  }
              }
              if (value.has(5)) {
                  const deductions = Array.from(value.get(5)!)
                  if (deductions.length > 1) {
                      log.push(`Inside Entity group '${key}', Product group '${pg[0]}' should have unique numbers of deductions throughout all products: (${deductions.join(' | ')})`);
                  }
              }
          }
      }

  }
}

function findTimeOverlap(log: string[]) {
  do {
      const key = RF.keys().next();
      if (key.done) break;
      const key1 = key.value
      const dic = RF.get(key1);
      RF.delete(key1);
      if (dic?.size! > 0) {
          const arr = Array.from(dic?.get(2)!)
          let groups: string[] = [], customers: string[] = [], overlaps: string[] = [];
          for (let [key2, value] of RF.entries()) {
              if (value.size > 0) {
                  const set = value.get(2)!
                  const common = arr.filter(el => set.has(el));
                  console.log(common)
                  overlaps = common.filter(el => {
                      const [_, end] = datesMap.get(key1)?.get(el);
                      const [start, __] = datesMap.get(key2)?.get(el);
                      return end > start;
                  });
                  if (overlaps.length) {
                      customers.push(...overlaps);
                      groups.push(key2);
                  }
              }

          }
          if (overlaps.length) {
              groups.unshift(key1);
          }
          if (groups.length) {
              customers = customers.map(el => `'${el}'`);
              groups = groups.map(el => `'${el}'`);
              const h1 = customers.length > 1 ? `Customers ${makeString(customers)}` : `Customer ${customers[0]}`;
              const h2 = groups.length > 1 ? `groups ${makeString(groups)}` : `group ${groups[0]}`;

              log.push(`${h1} has time overlap on entity ${h2}`);
          }
      }

  } while (datesMap.size);
}

function makeString(arr: string[]) {
  if (arr.length === 1) return arr[0];
  const firsts = arr.slice(0, arr.length - 1);
  const last = arr[arr.length - 1];
  return firsts.join(', ') + ' and ' + last;
}