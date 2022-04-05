import React, { useEffect } from 'react'

interface Props {
  struct: string
  changeStructureImg: (mrv: string, svg: string) => void
  saveFunc: React.MutableRefObject<(() => void) | undefined>
}

const ChemEditor: React.FC<Props> = ({
  struct,
  changeStructureImg,
  saveFunc,
}) => {
  useEffect(() => {
    let MarvinJSUtil = (window as any).MarvinJSUtil
    var marvin: any

    MarvinJSUtil.getPackage('#sketch')
      .then(
        function (marvinPackage: any) {
          marvin = marvinPackage
        },
        function (error: string) {
          alert(`Marvin package is not available: ${error}`)
        }
      )
      .then(() => {
        if (struct) marvin.sketcherInstance.importStructure('mrv', struct)
        saveFunc.current = () => {
          marvin.sketcherInstance.exportStructure('mrv').then(
            (mrv: string) => {
              changeStructureImg(
                mrv,
                marvin.ImageExporter.mrvToDataUrl(mrv, 'image/svg', {
                  width: 50,
                  height: 50,
                })
              )
            },
            (error: string) => {
              alert(`A probelem occured while save the new structure: ${error}`)
            }
          )
        }
      })
  })

  return (
    <iframe
      title='sketcher'
      id='sketch'
      src='marvinjs/editorws.html'
      width='100%'
      height='100%'
    />
  )
}

export default React.memo(ChemEditor, () => true)
