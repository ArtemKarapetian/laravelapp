<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $categoryId = $request->input('category');
        $categoryIds = $this->getCategoryIds($categoryId);

        $products = Product::whereIn('category_id', $categoryIds)
            ->orderBy('id')
            ->paginate(9);

        return ProductResource::collection($products);
    }

    private function getCategoryIds($categoryId)
    {
        $categoryIds = [$categoryId];
        $children = Category::where('parent_id', $categoryId)->get();

        foreach ($children as $child) {
            if ($child->id !== $categoryId) {
                $categoryIds = array_merge($categoryIds, $this->getCategoryIds($child->id));
            }
        }

        return $categoryIds;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProductRequest  $request
     * @return  \Illuminate\Http\Response
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $product = Product::create($data);
        return response(['data' => new ProductResource($product), 201]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \App\Http\Resources\ProductResource
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProductRequest  $request
     * @param  int  $id
     * @return \App\Http\Resources\ProductResource
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $product->update($data);
        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }
}
