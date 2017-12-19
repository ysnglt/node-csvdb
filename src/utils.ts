const isSubsetOf = (subset: Object, obj: Object) => {
  for (const key of Object.keys(subset)) {
    if (subset[key] != obj[key]) return false;
  }
  return true;
};

export = {
  isSubsetOf: isSubsetOf
};
