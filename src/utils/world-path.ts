const prefix = {
  's:': 'star',
  'p:': 'planet',
  'r:': 'region',
  'm:': 'moon',
  'b:': 'belt',
  'c:': 'construction',
} as const;

type Pos = { [K in typeof prefix[keyof typeof prefix]]: string };

export interface WorldPath extends Pos {
  path: string;
  galaxy: string;
  system: string;
  target: '' | 'galaxy' | 'system' | typeof prefix[keyof typeof prefix];
  groups: WorldPath['target'][];
}

export const parseWorldPath = (path = '') => {
  const [galaxy, system, ...nodes] = path.split('/');
  const position: WorldPath = {
    path,
    galaxy,
    system,
    star: '',
    planet: '',
    region: '',
    moon: '',
    belt: '',
    construction: '',
    target: system ? 'system' : galaxy ? 'galaxy' : '',
    // @ts-ignore
    groups: [galaxy && 'galaxy', system && 'system'].filter(Boolean),
  };
  nodes.forEach((node, index) => {
    // @ts-ignore
    const pre = prefix[node.substring(0, 2)]; // todo: allow more letters in prefix
    if (pre) {
      position.groups.push(pre);
      // @ts-ignore
      position[pre] = node.substring(2, node.length);
    }
    if (index === nodes.length - 1) position.target = pre;
  });
  return position;
};
