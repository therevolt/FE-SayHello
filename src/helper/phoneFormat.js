const PhoneFormat = (value) => {
  if (value) {
    const json = {
      num1: value
        .split("")
        .filter((i, j) => j < 4 && i)
        .join(""),
      num2: value
        .split("")
        .filter((i, j) => j >= 4 && j < 8 && i)
        .join(""),
      num3: value
        .split("")
        .filter((i, j) => j >= 8 && j < 12 && i)
        .join(""),
      numN: value
        .split("")
        .filter((i, j) => j >= 12 && i)
        .join(""),
    };
    return json.num1
      ? `+62 ${json.num1} ${json.num2} ${json.num3}${json.numN && ` ${json.numN}`}`
      : " ";
  } else {
    return " ";
  }
};

export default PhoneFormat;
