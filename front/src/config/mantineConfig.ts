import { createTheme, MantineColorScheme } from "@mantine/core";

const theme = createTheme({
	primaryColor: "blue",
	colors: {
		gray: [
			"#f5f5f5",
			"#e7e7e7",
			"#cdcdcd",
			"#b2b2b2",
			"#9a9a9a",
			"#8b8b8b",
			"#848484",
			"#717171",
			"#656565",
			"#575757",
		],
	},
});

const mantineConfig = {
	defaultColorScheme: "dark" as MantineColorScheme,
	theme,
	withCssVariables: true,
};

export default mantineConfig;
