const re = /\/([^\/]+)\.svg/;
// const svgIcons = import.meta.globEager("../../icons/svg/**/*.svg");
const svgIcons = import.meta.glob("../../icons/svg/**/*.svg", { eager: true });
export default Object.keys(svgIcons).map((i) => i.match(re)[1]);
