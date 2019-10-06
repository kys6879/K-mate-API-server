function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true,
    });
}

define("USER_TYPE", {
    "USER": "USR",
    "MATE": "MAT",
});