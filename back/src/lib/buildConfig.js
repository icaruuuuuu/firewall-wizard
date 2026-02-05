export function build(config, level = 0, parentId = 0) {
  const INDENT = "\t";
  
  if (!config || !Array.isArray(config) || config.length < 3) {
    return "";
  }

  switch (level) {
    case 0: // Tabelas
      return config[0].map(table => 
        `table ${table.name} {\n` +
        build(config, 1, table.id) +
        "}\n\n"
      ).join('');

    case 1: // Chains
      let chainsOutput = "";
      for (const chain of config[1]) {
        if (chain.tableId === parentId) {
          chainsOutput += 
            INDENT.repeat(level) + `${chain.name} {\n` +
            INDENT.repeat(level + 1) +
            `type ${chain.type} hook ${chain.hook} ` +
            `priority ${chain.priority}; policy ${chain.policy};\n` +
            build(config, 2, chain.id) +
            INDENT.repeat(level) + "}\n";
        }
      }
      return chainsOutput;

    case 2: // Rules
      let rulesOutput = "";
      for (const rule of config[2]) {
        if (rule.chainId === parentId) {
          rulesOutput += 
            INDENT.repeat(level) + 
            `${rule.expression} ${rule.statement};\n`;
        }
      }
      return rulesOutput;

    default:
      return "";
  }
}
