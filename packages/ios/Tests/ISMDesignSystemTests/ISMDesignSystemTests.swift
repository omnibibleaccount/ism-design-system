import XCTest
import SwiftUI
import UIKit
import ISMDesignSystem

final class ISMDesignSystemTests: XCTestCase {

    // MARK: Helpers

    private func rgba(_ color: Color) -> (r: CGFloat, g: CGFloat, b: CGFloat, a: CGFloat) {
        var r: CGFloat = 0
        var g: CGFloat = 0
        var b: CGFloat = 0
        var a: CGFloat = 0
        UIColor(color).getRed(&r, green: &g, blue: &b, alpha: &a)
        return (r, g, b, a)
    }

    private func assertColor(_ color: Color, hex: UInt32, file: StaticString = #filePath, line: UInt = #line) {
        let c = rgba(color)
        let accuracy: CGFloat = 0.003
        XCTAssertEqual(c.r, CGFloat((hex >> 16) & 0xFF) / 255, accuracy: accuracy, "red", file: file, line: line)
        XCTAssertEqual(c.g, CGFloat((hex >> 8) & 0xFF) / 255, accuracy: accuracy, "green", file: file, line: line)
        XCTAssertEqual(c.b, CGFloat(hex & 0xFF) / 255, accuracy: accuracy, "blue", file: file, line: line)
    }

    private func luminance(_ color: Color) -> Double {
        let c = rgba(color)
        func channel(_ v: CGFloat) -> Double {
            let x = Double(v)
            return x <= 0.03928 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b)
    }

    private func contrast(_ a: Color, _ b: Color) -> Double {
        let la = luminance(a)
        let lb = luminance(b)
        let lighter = max(la, lb)
        let darker = min(la, lb)
        return (lighter + 0.05) / (darker + 0.05)
    }

    // MARK: Tokens

    func testHorizonBlueIs046DE3() {
        assertColor(ISMColor.horizonBlue, hex: 0x046DE3)
        assertColor(ISMColor.actionPrimary, hex: 0x046DE3)
    }

    func testKnownColourValues() {
        assertColor(ISMColor.black, hex: 0x000000)
        assertColor(ISMColor.white, hex: 0xFFFFFF)
        assertColor(ISMColor.offWhite, hex: 0xF7F7F5)
        assertColor(ISMColor.charcoal900, hex: 0x161819)
    }

    func testTapTargetAndControlSizes() {
        XCTAssertEqual(ISMLayout.tapTarget, 44)
        XCTAssertEqual(ISMSize.controlMd, 44)
        XCTAssertEqual(ISMSize.controlLg, 52)
        XCTAssertEqual(ISMSize.field, 48)
        XCTAssertEqual(ISMSize.focusWidth, 2)
        XCTAssertEqual(ISMSize.focusOffset, 2)
        XCTAssertGreaterThanOrEqual(ISMSize.controlMd, ISMLayout.tapTarget)
    }

    func testSpacingAndRadiusScale() {
        XCTAssertEqual(ISMSpacing.space1, 4)
        XCTAssertEqual(ISMSpacing.space4, 16)
        XCTAssertEqual(ISMSpacing.space5, 24)
        XCTAssertEqual(ISMRadius.radiusMd, 12)
        XCTAssertEqual(ISMRadius.radiusLg, 20)
        XCTAssertEqual(ISMRadius.radiusPill, 999)
    }

    func testDisabledOpacityAndMotion() {
        XCTAssertEqual(ISMOpacity.opacityDisabled, 0.45, accuracy: 0.0001)
        XCTAssertEqual(ISMMotion.durationSpin, 0.8, accuracy: 0.0001)
    }

    func testTypographyTokens() {
        XCTAssertEqual(ISMType.webBody.size, 18)
        XCTAssertEqual(ISMType.webH1.size, 64)
        XCTAssertTrue(ISMType.scripture.serif)
        XCTAssertFalse(ISMType.webBody.serif)
        XCTAssertEqual(ISMTypeStyle.allCases.count, 22)
        XCTAssertEqual(ISMTypeStyle.scripture.token.size, ISMType.scripture.size)
    }

    // MARK: Scripts

    func testScriptLineHeights() {
        XCTAssertEqual(ISMScriptSupport.lineHeight(for: "am", heading: false), 1.65)
        XCTAssertEqual(ISMScriptSupport.lineHeight(for: "ti", heading: false), 1.65)
        XCTAssertEqual(ISMScriptSupport.lineHeight(for: "my", heading: false), 1.9)
        XCTAssertEqual(ISMScriptSupport.lineHeight(for: "ar", heading: false), 1.9)
        XCTAssertEqual(ISMScriptSupport.lineHeight(for: "fa", heading: false), 1.9)
        XCTAssertEqual(ISMScriptSupport.lineHeight(for: "ur-PK", heading: false), 1.9)
        XCTAssertNil(ISMScriptSupport.lineHeight(for: "en", heading: false))
        XCTAssertNil(ISMScriptSupport.lineHeight(for: nil, heading: false))
    }

    func testRTLDetection() {
        XCTAssertTrue(ISMScriptSupport.isRTL("ar"))
        XCTAssertTrue(ISMScriptSupport.isRTL("fa-IR"))
        XCTAssertTrue(ISMScriptSupport.isRTL("ur"))
        XCTAssertTrue(ISMScriptSupport.isRTL("he"))
        XCTAssertFalse(ISMScriptSupport.isRTL("am"))
        XCTAssertFalse(ISMScriptSupport.isRTL("en"))
        XCTAssertTrue(ISMScriptSupport.isComplexScript("my"))
        XCTAssertFalse(ISMScriptSupport.isComplexScript("sw"))
    }

    func testDirectionalIcons() {
        XCTAssertTrue(ISMUIIcon.chevronRight.mirrorsInRTL)
        XCTAssertTrue(ISMUIIcon.arrowLeft.mirrorsInRTL)
        XCTAssertFalse(ISMUIIcon.play.mirrorsInRTL)
        XCTAssertFalse(ISMUIIcon.arrowUpRight.mirrorsInRTL)
        XCTAssertFalse(ISMUIIcon.check.mirrorsInRTL)
    }

    // MARK: Theme

    func testThemeLightAndDarkPairs() {
        let light = ISMTheme.resolve(.light)
        let dark = ISMTheme.resolve(.dark)
        assertColor(light.background, hex: 0xF7F7F5)
        assertColor(dark.background, hex: 0x000000)
        assertColor(light.primary, hex: 0x046DE3)
        assertColor(dark.link, hex: 0x7FA6F7)
        assertColor(light.link, hex: 0x046DE3)
        XCTAssertFalse(light.isDark)
        XCTAssertTrue(dark.isDark)
    }

    func testApprovedContrastPairs() {
        // rules/accessibility.md
        XCTAssertGreaterThanOrEqual(contrast(ISMColor.white, ISMColor.horizonBlue), 4.5)
        XCTAssertGreaterThanOrEqual(contrast(ISMColor.horizonBlue, ISMColor.white), 4.5)
        XCTAssertGreaterThanOrEqual(contrast(ISMColor.gray600, ISMColor.white), 4.5)
        XCTAssertGreaterThanOrEqual(contrast(ISMColor.blueOnDark, ISMColor.black), 4.5)
        let light = ISMTheme.resolve(.light)
        XCTAssertGreaterThanOrEqual(contrast(light.textTertiary, light.surface), 4.5)
        XCTAssertGreaterThanOrEqual(contrast(light.error, light.surface), 4.5)
        XCTAssertGreaterThanOrEqual(contrast(light.success, light.surface), 4.5)
        let dark = ISMTheme.resolve(.dark)
        XCTAssertGreaterThanOrEqual(contrast(dark.link, dark.background), 4.5)
        XCTAssertGreaterThanOrEqual(contrast(dark.error, dark.background), 4.5)
    }

    // MARK: Fonts

    func testFontsRegister() {
        XCTAssertTrue(ISMFonts.register(), "Every bundled font file must be found in the resource bundle")
        for name in ISMFonts.fileNames {
            XCTAssertNotNil(UIFont(name: name, size: 12), "Font \(name) did not register")
        }
        XCTAssertEqual(ISMFont.postScriptName(serif: false, weight: .semibold, italic: false), "Inter-SemiBold")
        XCTAssertEqual(ISMFont.postScriptName(serif: true, weight: .regular, italic: true), "Lora-Italic")
    }

    // MARK: Icons

    private func assertImageExists(_ name: String, file: StaticString = #filePath, line: UInt = #line) {
        let image = UIImage(named: name, in: ISMResources.bundle, compatibleWith: nil)
        XCTAssertNotNil(image, "Missing asset: \(name)", file: file, line: line)
    }

    func testEveryUIIconExists() {
        XCTAssertFalse(ISMUIIcon.allCases.isEmpty)
        for icon in ISMUIIcon.allCases {
            assertImageExists(icon.rawValue)
        }
    }

    func testEveryMinistryIconExists() {
        XCTAssertFalse(ISMMinistryIcon.allCases.isEmpty)
        for icon in ISMMinistryIcon.allCases {
            assertImageExists(icon.rawValue)
        }
    }

    func testEveryLogoExists() {
        XCTAssertEqual(ISMLogo.allCases.count, 4)
        for logo in ISMLogo.allCases {
            assertImageExists(logo.rawValue)
        }
    }
}
