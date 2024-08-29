# @blendduck/widget-sdk

Widget SDK for BlendDuck

## How to use

Add `@blendduck/widget-sdk` in your package.json

```json
{
  "dependencies": {
    "@blendduck/widget-sdk": "github:blendduck/widget-sdk.git"
  }
}
```

## Create a widget

Below is the definition of a Widget:

```ts
import { 
  ElementSchema, 
  ElementFieldConfig,
  AppearSchema,
  AppearFieldConfig,
} from "./config";

export default {
  name: 'counter',
  Widget: Widget,
  parameters: {
    schema: ElementSchema,
    fieldConfig: ElementFieldConfig,
  },
  appear: {
    schema: AppearSchema,
    fieldConfig: AppearFieldConfig,
  },
  defaults: {
    width: 400,
    height: 120,
  }
}
```

You need to define the Widget’s name and the actual React component.

The defaults field is used to define some default properties of the Widget, such as the default height and width after being added to the Stage, and whether it can be scaled proportionally.

![image](https://s.poutduck.com/tmp/sdk.png)

```ts
// config.ts
import { z } from "zod";

export const ElementSchema = z.object({
  value: z.coerce.number().default(100),
  format: z.object({
    unit: z.enum(['Normal', 'Percentage']).default('Normal'),
    decimal: z.coerce.number().default(0),
  }),
});

export const ElementFieldConfig = {
  value: {
    inputProps: {
      inline: true,
    }
  },
  format: {
    unit: {
    },
    decimal: {
      fieldType: 'number',
      inputProps: {
        inline: true,
        min: 0,
        max: 5,
      },
    }
  },
}

export const AppearSchema = z.object({
  from: z.coerce.number().default(0),
}).describe('From Value')

export const AppearFieldConfig = {
  from: {
    inputProps: {
      inline: true,
    }
  },
}
```

In the code where the Widget is implemented, you can use certain Hooks to get the current state of the component.

```ts
// Get properties of the widget defined using the schema
const parameters = useWidgetParameters<typeof ElementSchema>();
// Get size of the widget
const { width, height } = useWidgetStyles();
// Get the appear animation states
const appear = useWidgetAppear<typeof AppearSchema>();
```

When implementing animation transitions, you can determine the current value of appear and then use the interpolate method to calculate intermediate states.

```ts
export default function Widget() {
  const parameters = useWidgetParameters<typeof ElementSchema>()
  const appear = useWidgetAppear<typeof AppearSchema>();
  const { width, height } = useWidgetStyles();
  let start = parameters.value;
  let end = parameters.value;

  const format = parameters.format.unit
  const precision = parameters.format.decimal;

  let progress = 1;
  if (appear) {
    start = appear.data?.from;
    progress = Math.min(appear.frame / appear.durationInFrames, 1);
  }

  const calculateValue = (start: number, end: number) => {
    const currentValue = BlendDuckSDK.interpolate(progress, start, end, appear?.easing)
    return currentValue.toFixed(precision);
  };
  const currentValue = calculateValue(Number(start), Number(end));
  const style: React.CSSProperties = {}
  return (
    <div
      className='flex'
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
      }}
    >
    <div style={style}>
      {currentValue}
    </div>
    </div>
  );
}
```

If you encounter situations where resources need to be loaded, such as font loading, you should use the delayRender and continueRender methods provided by Remotion.

```ts
import { continueRender, delayRender } from 'remotion';

...
// in your Wiget React component
const [fontHandle] = useState(() => delayRender());

useEffect(() => {
  BlendDuckSDK.loadFont(fontFamily).then(() => {
    continueRender(fontHandle)
  })
}, [fontFamily])
...
```


## Create a custom Panel

You can use Radix UI themes and Tailwind CSS for Panel development. Additionally, you can use the @radix-ui/react-icons and lucide-react packages.

On the right side of the editor, there are a series of Panel buttons. The panels are dynamically loaded when a menu is clicked. 

Panels can be switched, which means components are re-rendered every time you switch back to them. If the panel does not need to globalize the state, React’s hook useState and useEffect can be used. 

If some components in the panel require user interaction, such as input fields or selection boxes, it is important to consider persisting these states. The SDK provides usePanelState to persistently retrieve and set the state.

```tsx
import React from "react";
import {
  TextArea,
} from "@radix-ui/themes";
import { CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash, Copy } from "lucide-react"
import { usePanelState } from "@blendduck/widget-sdk";


interface PanelState {
  text: string,
}

export const Panel: React.FC = () => {

  const {
    state,
    setState
  } = usePanelState<PanelState>({
    text: '',
  })
  
  return (
    <div className="p-4">
      <TextArea
        rows={4}
        value={text}
        onChange={(e) => {
          setState({
            text: e.currentTarget.value
          })
        }}
        placeholder="..." />
    </div>
  )
}

widgetLibrary.setPanel(Panel)
```


## Add a widget to the stage

You can call the `dispatchEvent` method to add a widget

You must get the scope variable from the process environment; these value differ between development and deployment, and the bundler will set them accordingly.

```tsx
// panel.tsx
import React from "react";
import { Button } from "@radix-ui/themes";
import * as BlendDuckWidgetSDK from "@blendduck/widget-sdk";

const scope = process.env.BLENDDUCK_WIDGET_SCOPE;

const Panel: React.FC = () => {
  const handleClick = () => {
    BlendDuckWidgetSDK.dispatchEvent("addWidget", {
      scope,
      widgetId: 'test', // your widget id
    });
  }

  return (
    <Button onClick={handleClick}>Add Widget</Button>
  )
}

```

## Add a audio to the timeline

You can call the `dispatchEvent` method to add an audio element to the timeline. You need to provide two parameters: name and url.​

```tsx
// panel.tsx
import React from "react";
import { Button } from "@radix-ui/themes";
import * as BlendDuckWidgetSDK from "@blendduck/widget-sdk";

const Panel: React.FC = () => {
  const handleClick = () => {
    BlendDuckWidgetSDK.dispatchEvent("addAudioPlay", {
      name: 'audio.mp3'
      url: 'https://xxx.xxx/audio.mp3'
    });
  }

  return (
    <Button onClick={handleClick}>Add Audio</Button>
  )
}

```