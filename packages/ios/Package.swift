// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "ISMDesignSystem",
    defaultLocalization: "en",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(name: "ISMDesignSystem", targets: ["ISMDesignSystem"])
    ],
    targets: [
        .target(
            name: "ISMDesignSystem",
            path: "Sources/ISMDesignSystem",
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "ISMDesignSystemTests",
            dependencies: ["ISMDesignSystem"],
            path: "Tests/ISMDesignSystemTests"
        )
    ]
)
