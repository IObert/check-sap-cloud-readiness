# Check SAP Cloud Readiness

## Description

Development activities for the SAP Cloud Platform often require certain tools to be installed prior to the actual development tasks. Installing as many tools yet unknown tools is always a hurdle for beginners and might cause confusion along the first steps taken on a new technology platform.

This tool allows users to run simple checks whether their individual development setup fulfills the requirements of a specific tutorial or workshop.

## Requirements

- [Node.js](https://nodejs.org/) (**version 8.5 or higher** ⚠️)
- **A working internet connectivity**

## Usage

This tool does **NOT** require an installation and shouldn't be installed at all.

Simply run this tool with:
```shell
# Generic version
npx check-sap-cloud-readiness --[dev-activity1] --[dev-activity2]

# For instance:
npx check-sap-cloud-readiness --codejam-cap
```

The tool will output a list fo all required tools and indicate whether the tools are installed or not. The tool will also suggest steps how to install the missing tool.

## Known Issues

Please look at our [GitHub Issues](https://github.com/SAP/check-sap-cloud-readiness/issues) .

## Support

This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

## To-Do

More development activities such as codejams or tutorials will be added.

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](/LICENSE) file.
