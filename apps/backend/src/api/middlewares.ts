import { defineMiddlewares } from "@medusajs/framework/http"
export default defineMiddlewares({routes:[{matcher:"/store/room-previews",methods:["POST"],bodyParser:{sizeLimit:"9mb"}}]})
