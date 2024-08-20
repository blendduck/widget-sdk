# @blendduck/widget-sdk

Widget SDK for BlendDuck

* [Documentation](https://www.notion.so/langduck/Addon-620cd27015aa4955a0c681c0a61b8439?pvs=4
)

## How to use

```tsx
// 在自定义面板中，可以使用 Radix UI Themes，Tailwind.css 进行开发。
// 图标可使用 @radix-ui/react-icons 和 lucide-react
import React from "react";
import {
  TextArea,
} from "@radix-ui/themes";
import { CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash, Copy } from "lucide-react"
import { usePanelState } from "@blendduck/widget-sdk";

/**
 * 编辑器的右侧有一系列的面板按钮，当点击菜单时，才会动态加载面板。
 * 面板可以被切换，这意味着组件每次切换回来都会重新渲染，如果面板中
 * 有一些组件需要与用户交互，比如输入框、选择框，需要考虑把这些状态
 * 进行持久化保存。如果面板中不需要考虑将状态全局化，使用 React 提供的 Hooks 即可。
 * 
 * SDK 提供了 usePanelState 进行状态的持久化获取和设置
 */
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